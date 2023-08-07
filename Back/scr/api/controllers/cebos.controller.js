const {
  deleteImgCeboCloudinary,
} = require('../../middlewares/filesCebo.middleware');
const Cebo = require('../models/cebo.model');
const dotenv = require('dotenv');
const Stock = require('../models/stock.model');

dotenv.config();

//--------------------------------------------------------------------------------
//····································CREAR CEBO··································
//--------------------------------------------------------------------------------

const añadirAlCatalogo = async (req, res, next) => {
  let catchImg = req.file?.path;
  try {
    await Cebo.syncIndexes();

    const newCebo = new Cebo(req.body);
    try {
      if (req.file) {
        newCebo.imagen = req.file.path;
      } else {
        newCebo.imagen =
          'https://www.micebo.es/data/blog/255/images/_mini/post_grd/738/coreano-cebo.jpg?t=20220422b';
      }
      const postCebo = await newCebo.save();

      if (postCebo) {
        // Redirección a la ruta para crear un stock con el ID del cebo recién creado
        return res.redirect(
          `http://localhost:8000/api/v1/stock/crearstock/${postCebo._id}`
        );
      } else {
        return res.status(400).json('Error create Cebo');
      }
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCeboCloudinary(catchImg);
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································UPDATE········································
//--------------------------------------------------------------------------------

const updateCebo = async (req, res, next) => {
  let catchImg = req.file?.path;
  const { id } = req.params;
  try {
    await Cebo.syncIndexes();

    const patchCebo = new Cebo(req.body);

    if (req.file) {
      patchCebo.imagen = req.file.path;
    }
    patchCebo._id = id;

    try {
      try {
        const ceboBuscado = await Cebo.findByIdAndUpdate(id, patchCebo);
        if (req.file) {
          deleteImgCeboCloudinary(ceboBuscado.imagen);
        }
      } catch (error) {
        return res.status(404).json(error.message);
      }

      const updateCebo = await Cebo.findById(id);

      const updateKeys = Object.keys(req.body);

      const testUpdate = [];

      updateKeys.forEach((item) => {
        if (updateCebo[item] == req.body[item]) {
          testUpdate.push({
            [item]: true,
          });
        } else {
          testUpdate.push({
            [item]: false,
          });
        }
      });
      if (req.file) {
        updateCebo.imagen == req.file.path
          ? testUpdate.push({
              file: true,
            })
          : testUpdate.push({
              file: false,
            });
      }
      return res.status(200).json({
        testUpdate,
      });
    } catch (error) {
      return res.status(404).json(error.message);
    }
  } catch (error) {
    if (req.file) deleteImgCeboCloudinary(catchImg);
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································DELETE········································
//--------------------------------------------------------------------------------

const deleteCebo = async (req, res, next) => {
  const { id } = req.params;
  try {
    const ceboBuscado = await Cebo.findByIdAndDelete(id);
    if (await Cebo.findById(id)) {
      return res.status(404).json('Dont delete');
    } else {
      deleteImgCeboCloudinary(ceboBuscado.imagen);
      return res.status(200).json('ok delete');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET ALL·······································
//--------------------------------------------------------------------------------

const getAllCebo = async (req, res, next) => {
  try {
    const cebosAll = await Cebo.find().populate('stocks');
    if (cebosAll) {
      return res.status(200).json(cebosAll);
    } else {
      return res.status(404).json('Failed getAll controller to cebos');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET BY NAME···································
//--------------------------------------------------------------------------------

const getByNameCebo = async (req, res, next) => {
  try {
    let { ceboVivo } = req.params;
    ceboVivo = ceboVivo.toLowerCase();
    const regex = new RegExp(ceboVivo, 'i');
    // recordar que el find nos permite traernos todosl os elementos que nosotros pongamos en las condicones de sus parentesis
    //! EL FIND DEVUELVE UN ARRAY DE ELMENTOS
    //! EL FINDBYID DEVUELVE O UN OBJETO O DEVUELVE UN NULL SI NO LO HA ENCONTRADO
    const cebosByName = await Cebo.find({
      ceboVivo: { $regex: regex },
    }).populate('stocks');
    if (cebosByName.length > 0) {
      return res.status(200).json(cebosByName);
    } else {
      return res.status(404).json('Error to controller getByname Cebos');
    }
  } catch (error) {
    return next(error);
  }
};

//--------------------------------------------------------------------------------
//··································GET BY ID·····································
//--------------------------------------------------------------------------------

const getByIdCebo = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);

    /// populate nos sirve para que los elementos del Schema del modelo que esten
    //con objectID podamos acceder a su info de otro modelo
    const cebosById = await Cebo.findById(id).populate('stocks');
    if (cebosById) {
      return res.status(200).json(cebosById);
    } else {
      return res.status(404).json('Error controller GetById Cebos');
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  añadirAlCatalogo,
  updateCebo,
  deleteCebo,
  getAllCebo,
  getByNameCebo,
  getByIdCebo,
};
