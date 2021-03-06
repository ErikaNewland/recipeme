import axios from 'axios'
import Promise from 'bluebird'
import history from '../history'

const app_id = "1bae5fc6"
const app_key = "3eefade9510fd0f9d50fcfeb98587587"

const GET_RECIPES = 'GET_RECIPES'

export const getRecipes = recipes => ({ type: GET_RECIPES, recipes })

export const getRecipesByIngredient = (ingredient) => dispatch => {
  return axios.get(`https://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&requirePictures=true&allowedIngredient=${ingredient}&maxResult=50&requirePictures=true`)
    .then(res => res.data)
    .then(recipes => {
      dispatch(getRecipes(recipes.matches))
      })
    .catch(console.log)
}

// gets recipes with 2 most common ingredients (specific to user) in the given category - can adjust
// these parameters if necessary
export const getRecipesByDefCategory = (deficientCategory) => dispatch => {
  return axios.get(`/api/recipes/${deficientCategory}`)
    .then(res => res.data)
    .then(recipes => {
          dispatch(getRecipes(recipes))

      })
    .catch(console.log)
}

export function fetchIDofDefNutrient(nutrient) {
  return function thunk(dispatch) {
    return axios.get(`/api/nutrients/${nutrient}`)
      .then(res => res.data)
      .then(defNutId => {
        const nutID = defNutId.apiId
        const nutSuggested = defNutId.suggested
        return axios.get(`/api/recipes`)
          .then(frequencies => frequencies.data)
          .then(ingredients => {
            const food1 = axios.get(`http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&requirePictures=true&allowedIngredient=${ingredients[0].ingredientName}&nutrition.${nutID}.min=${nutSuggested}&maxResult=50`)
            const food2 = axios.get(`http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&requirePictures=true&allowedIngredient=${ingredients[1].ingredientName}&nutrition.${nutID}.min=${nutSuggested}&maxResult=50`)
            return Promise.all([food1, food2])
            .then(promises => {
              let recipes = []
              promises.forEach(promise => {
                if (promise) recipes = recipes.concat(promise.data.matches)
              })
              return recipes
            })
            .then(recipes => {
              dispatch(getRecipes(recipes))
            })
          })

      .catch(console.log)
      })

  }
}

export const getRecipesByDefNutr = (deficientNutrientFoods) => dispatch => {
  const food1 = axios.get(`http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&q=${deficientNutrientFoods[0]}&maxResult=50`)
  const food2 = axios.get(`http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&q=${deficientNutrientFoods[1]}&maxResult=50`)
  const food3 = axios.get(`http://api.yummly.com/v1/api/recipes?_app_id=${app_id}&_app_key=${app_key}&q=${deficientNutrientFoods[2]}&maxResult=50`)

  Promise.all([food1, food2, food3])
  .then(promises => {
    let recipes = []
    promises.forEach(promise => {
      recipes = recipes.concat(promise.data.matches)
    })
    return recipes
  })
  .then(recipes => {
    dispatch(getRecipes(recipes))

  })
  .catch(console.log)

}

export const getRecipeDetails = (recipeId) => dispatch => {
  return axios.get(`http://api.yummly.com/v1/api/recipe/${recipeId}?_app_id=${app_id}&_app_key=${app_key}`)
    .then(res => res.data)
    .then(recipe => {
      window.open(recipe.source.sourceRecipeUrl)
    })
    .catch(console.log)
}


const getRecipesReducer = (state=[], action) => {
  switch(action.type) {
    case GET_RECIPES:
      return action.recipes
    default:
      return state
  }
}

export default getRecipesReducer

