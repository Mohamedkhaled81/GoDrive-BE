import { authService } from '../services/auth.service.js';


const handleError = (res, error) => {
  return res.status(400).json({
    message: error.message || 'Something went wrong',
  });
};

export const authController = {


  async register(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.register(email, password);

      res.status(201).json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

 
  async verifyAccount(req, res) {
    try {
      const { email, code } = req.body;

      const result = await authService.verifyAccount(email, code);

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

 
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  
  async verifyLogin(req, res) {
    try {
      const { email, code } = req.body;

      const result = await authService.verifyLogin(email, code);

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  },


  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      const result = await authService.forgotPassword(email);

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  },

  
  async resetPassword(req, res) {
    try {
      const { email, code, newPassword } = req.body;

      const result = await authService.resetPassword(
        email,
        code,
        newPassword
      );

      res.json(result);
    } catch (error) {
      handleError(res, error);
    }
  },
};