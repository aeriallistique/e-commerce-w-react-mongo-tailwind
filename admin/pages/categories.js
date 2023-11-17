import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

 function Categories({swal}){
  const [editedCategory, setEditedCategory]= useState(null);
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState('');
  const [properties, setProperties] = useState([]);

  useEffect(()=>{
    fetchCategories()
  },[])

  function fetchCategories(){
    axios.get('/api/categories').then(result=>{
      setCategories(result.data);
    })
  }

  function handlePropertyNameChange(index,property, newName){
    setProperties(prev=> {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }

  function handlePropertyValuesChange(index,property, newValues){
    setProperties(prev=> {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    })
  }

  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name, 
      parentCategory, 
      properties: properties.map(p => ({
        name:p.name,
        values: p.values.split(','),
       }))
    }

    if(editedCategory){
      data._id = editedCategory?._id;
      await axios.put('/api/categories', data)
      setEditedCategory(null);
    }else{
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('')
    setProperties([])
    fetchCategories();
  }

  function editCategory(category){
    setEditedCategory(category);
    setName(category.name)
    setParentCategory(category.parent?._id)
    setProperties(
      category.properties.map(({name,values})=> ({
        name,
        values: values.join(',')
      })))
  }

  function deleteCategory(category){
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,   
  }).then(async result => {
      // when confirmed and promise resolved...
      if(result.isConfirmed){
        const {_id} = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
  })
  }

  function addProperty(){
    setProperties(prev=> {
      return [...prev, {name:'', values:''}];
    })
  }

  function removeProperty(indexToRemove){
    setProperties(prev=>{
      return [...prev].filter((p, pIndex)=>{
        return pIndex !== indexToRemove;
      })
    })
  }


  return(
    <Layout>
      <h1>categories</h1>
      <label >
        {editedCategory ? `Edit Category ${editedCategory.name} `: 'Create Category name' }
      </label>
      <form onSubmit={saveCategory} className=" py-1">
        <div className="flex gap-1">
          <input  
            type="text" 
            placeholder={'Category name'} 
            value={name}
            onChange={ev=> setName(ev.target.value)}
            />
          <select 
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
            >
            <option value="0">No parent category</option>
            {categories?.length > 0 && categories.map(category =>(
              <option 
                value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div> 
        <div className="mb-2">
          <label className="block">Properties</label>
          <button 
            type="button" 
            className="btn-default text-sm mb-2"
            onClick={addProperty}>
            Add new property
          </button>
          {properties.length > 0 && properties.map((property,index)=>(
            <div className="flex gap-1 mb-2">
              <input 
                  className="mb-0"
                  type="text" 
                  value={property.name} 
                  placeholder="property name (example: color)" 
                  onChange={(ev) => handlePropertyNameChange(index,
                      property, ev.target.value)}/>
              <input
                  className="mb-0" 
                  type="text" 
                  value={property.values} 
                  placeholder="values, comma separated" 
                  onChange={ev=> handlePropertyValuesChange(index, 
                      property, ev.target.value)}/>
              <button 
                  className="btn-default"
                  type="button"
                  onClick={()=> removeProperty(index)}>
                  Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button 
                type="button"
                className="btn-default"
                onClick={()=>{ 
                  setEditedCategory(null);
                  setName('');
                  setParentCategory('');
                  setProperties([]);
                }}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">Save</button>
        </div>
        
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories?.length > 0 && categories.map(category =>(
            <tr>
              <td key={category._id}>{category.name}</td>
              <td key={category._id +1}>{category?.parent?.name}</td>
              <td>
                
                <button 
                  className="btn-primary mr-1"
                  onClick={()=> editCategory(category)}
                  >
                    Edit
                  </button>
                <button 
                  onClick={()=> deleteCategory(category)}
                  className="btn-primary">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      
    </Layout>
  )
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal}/>
))