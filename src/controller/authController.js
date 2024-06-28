import authService from "../service/authService.js";

const registration = async (req, res, next) => {
  try {
    const data = await authService.registrationModel(req.body);
    res.status(201).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.loginModel(req.body);
    res
      .status(200)
      .cookie("token", data.refreshToken, {
        path: "/",
        signed: true,
        httpOnly: true,
      })
      .json({
        data: [
          {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
          },
          {
            token: data.token,
          },
        ],
      });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.signedCookies["token"];
    const data = await authService.refreshToken(refreshToken);
    res
      .status(200)
      .cookie("token", data.refreshToken, {
        path: "/",
        signed: true,
        httpOnly: true,
      })
      .json({
        token: data.token,
      });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {};

export default {
  registration,
  login,
  refreshToken,
  logout,
};
