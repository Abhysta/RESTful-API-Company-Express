import appService from "../service/appService.js";

const getData = async (req, res, next) => {
  try {
    const id = req.user.id;
    const skip = req.params.pages;
    console.log(skip);
    const data = await appService.getData(id, skip);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const addData = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(req.body);
    const data = await appService.addData(req.body, req.user, file);

    res.status(200).json({
      data: data,
    });
    // const data = await appService.addData(req.body, req.user);
    // res.status(200).json({
    //   data: data,
    // });
  } catch (error) {
    next(error);
  }
};

const getDataById = async (req, res, next) => {
  try {
    const id = req.params.idCompany;
    const data = await appService.getDataById(id);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const deleteData = async (req, res, next) => {
  try {
    const id = req.params.idCompany;
    const user = req.user.id;
    const data = await appService.deleteData(id, user);
    res.status(200).json({
      data: "OK",
    });
  } catch (error) {
    next(error);
  }
};

const editData = async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user.id;
    const id = req.params.idCompany;
    req.body.id_user = user;
    req.body.id_company = id;
    console.log(req.body, req.file);
    const data = await appService.editData(req.body, file);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const searchData = async (req, res, next) => {
  try {
    const user = req.user.id;
    const request = {
      name: req.query.name,
      position: req.query.position,
      page: req.query.page,
      size: req.query.size,
    };

    console.log(request);
    const data = await appService.searchData(user, request);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getData,
  addData,
  getDataById,
  deleteData,
  editData,
  searchData,
};
