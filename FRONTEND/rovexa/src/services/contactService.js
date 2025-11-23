// src/services/contactService.js
import api from "../api"; // same axios instance you use in authService

const contactService = {
  submitContact: async (payload) => {
    const res = await api.post("/contact", payload); // hits /api/contact
    return res.data;
  },
};

export default contactService;
