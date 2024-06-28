import { prisma } from "../database/prisma.js";
import { ResponseError } from "../error/responseError.js";
import {
  company,
  editDataValidate,
  searchValidate,
} from "../validation/appValidation.js";
import { validates } from "../validation/validation.js";
import { uuidv7 } from "uuidv7";
import { validateBufferMIMEType } from "validate-image-type";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/firebase.js";
import { FunctionDeclarationSchemaType } from "firebase/vertexai-preview";

const getData = async (id, skip) => {
  const data = await prisma.company.findMany({
    take: 10,
    skip: (skip - 1) * 10,
    where: {
      id_user: id,
    },
    orderBy: {
      timeAdd: "asc",
    },
    select: {
      id_company: true,
      name: true,
      email_company: true,
      position: true,
      address: true,
      status: true,
      phone: true,
      image: true,
    },
  });

  if (!data || data < 1) {
    throw new ResponseError("Data Not Found", 404);
  }

  return data;
};

const addData = async (req, user, file) => {
  req.id_user = user.id;
  const date = new Date();
  req.timeAdd = date;
  console.log(req);

  const data = validates(company, req);
  console.log(data);

  const validateResult = await validateBufferMIMEType(file.buffer, {
    originalFilename: file.originalname,
    allowMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
  });

  if (!validateResult.ok) {
    throw new ResponseError("Only image allowed and less than 1mb", 400);
  }

  const idCompany = uuidv7();

  data.id_company = idCompany;

  const storageRef = ref(
    storage,
    `images/${req.id_user}/${data.id_company}-${data.name}`
  );
  const uploadTask = await uploadBytes(storageRef, file.buffer);

  const getData = getStorage();
  const pathReference = await getDownloadURL(
    ref(getData, `images/${req.id_user}/${data.id_company}-${data.name}`)
  );

  data.image = pathReference;

  return await prisma.company.create({
    data: data,
    select: {
      id_company: true,
      name: true,
      position: true,
      id_user: true,
      image: true,
      timeAdd: true,
    },
  });
};

const getDataById = async (id) => {
  const data = await prisma.company.findUnique({
    where: {
      id_company: id,
    },
  });

  if (!data) {
    throw new ResponseError("Data Not Found", 404);
  }

  return data;
};

const deleteData = async (id, user) => {
  const data = await prisma.company.findUnique({
    where: {
      id_company: id,
    },
  });

  if (!data) {
    throw new ResponseError("Data Not Found", 404);
  }

  if (data.id_user !== user) {
    throw new ResponseError("Cant Delete Data Unauthorized", 401);
  }

  const storage = getStorage();
  const delRef = ref(
    storage,
    `images/${data.id_user}/${data.timeAdd}-${data.name}`
  );

  deleteObject(delRef)
    .then(() => {
      console.log("File deleted successfully");
    })
    .catch((error) => {
      throw new ResponseError(error.message, 500);
    });

  return await prisma.company.delete({
    where: {
      id_company: id,
    },
  });
};

const editData = async (req, file) => {
  console.log(file);
  const checkData = await getDataById(req.id_company);

  if (checkData.id_user !== req.id_user) {
    throw new ResponseError("Cant Edit Data Unauthorized", 401);
  }

  if (!req.name) {
    req.name = checkData.name;
  }

  if (!req.position) {
    req.position = checkData.position;
  }

  if (!req.status) {
    req.status = checkData.status;
  }

  const dataFirst = validates(editDataValidate, req);
  console.log(dataFirst);

  if (file === undefined) {
    dataFirst.image = checkData.image;
  } else {
    const validateResult = await validateBufferMIMEType(file.buffer, {
      originalFilename: file.originalname,
      allowMimeTypes: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    });

    if (!validateResult.ok) {
      throw new ResponseError("Only image allowed and less than 1mb", 400);
    }

    const storageDel = getStorage();
    const delRef = ref(
      storageDel,
      `images/${checkData.id_user}/${checkData.id_company}-${checkData.name}`
    );

    deleteObject(delRef)
      .then(() => {
        console.log("File deleted successfully");
      })
      .catch((error) => {
        throw new ResponseError(error.message, 401);
      });

    const date = new Date();
    dataFirst.timeAdd = date;
    const storageRef = ref(
      storage,
      `images/${dataFirst.id_user}/${dataFirst.id_company}-${dataFirst.name}`
    );
    const uploadTask = await uploadBytes(storageRef, file.buffer);

    const getData = getStorage();
    const pathReference = await getDownloadURL(
      ref(
        getData,
        `images/${dataFirst.id_user}/${dataFirst.id_company}-${dataFirst.name}`
      )
    );
    dataFirst.image = pathReference;
  }

  console.log(dataFirst);

  return await prisma.company.update({
    where: {
      id_company: dataFirst.id_company,
    },
    data: dataFirst,
    select: {
      id_company: true,
      name: true,
      position: true,
      id_user: true,
      image: true,
      timeAdd: true,
    },
  });
};

const searchData = async (user, req) => {
  console.log(req);

  const data = validates(searchValidate, req);
  console.log(data);

  const skip = (data.page - 1) * data.size;
  console.log(skip);

  const filterSearch = [];

  filterSearch.push({
    id_user: user,
  });

  if (data.name) {
    filterSearch.push({
      name: {
        contains: data.name,
      },
    });
  }

  if (data.position) {
    filterSearch.push({
      position: {
        contains: data.position,
      },
    });
  }

  const result = await prisma.company.findMany({
    take: data.size,
    skip: skip,
    where: {
      AND: filterSearch,
    },
  });

  if (!result) {
    throw new ResponseError("Data Not Found", 404);
  }

  const count = await prisma.company.count({
    where: {
      AND: filterSearch,
    },
  });

  if (count < 1) {
    throw new ResponseError("Data Not Found", 404);
  }

  return {
    data: result,
    paging: {
      total_item: count,
      page: data.page,
      total_page: Math.ceil(count / data.size),
    },
  };
};

export default {
  getData,
  addData,
  getDataById,
  deleteData,
  editData,
  searchData,
};
