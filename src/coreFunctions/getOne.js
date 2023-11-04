import { Op } from 'sequelize';

const getOne = (model) => async (data, attributes, include) => {
  try {
    if (typeof include == 'array' && include.length == 0) include = {};
    const result = await model.findOne({ where: data, attributes, include });
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    throw new Error(`Error getting ${model.modelName}: ${error.message}`);
  }
};
const getList = (model) => async (data, attributes, include) => {
  try {
    if (typeof include == 'array' && include.length == 0) include = {};
    const result = await model.findAll({ where: data, attributes, include });
    if (!result) {
      return null;
    }
    return result;
  } catch (error) {
    throw new Error(`Error getting ${model.modelName}: ${error.message}`);
  }
};

export { getOne, getList };
