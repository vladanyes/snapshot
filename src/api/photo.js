import axios from 'axios';

export default {
  // upload: file => axios.post('http://localhost:3000/snapshot', file),
  upload: file => axios.post('http://snapshot--backend.herokuapp.com/snapshot/', file),
};


