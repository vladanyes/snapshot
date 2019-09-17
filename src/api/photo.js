import axios from 'axios';

export default {
  upload: file => axios.post('http://snapshot--backend.herokuapp.com/snapshot/', file),
  uploadById: id => axios.get(`http://snapshot--backend.herokuapp.com/snapshot/${id}`),
};


