
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useState } from 'react'

export default function App() {
 const[newItem,setNweItem] =useState("")
 const[todos ,settodos]=useState([])
 settodos(currenttodos=>{
  return[
    { id:crypto.randomUUID(),title:newitem,completed:false  }
  ]
 })

 function handleSubmit(e) {
  e.preventDefault()
 }
 

  return (   
                    
<>
  <form  onSubmit={handleSubmit} className="new_item_form"> 
  <div className="form_row">
    <label htmlFor="item"> new item </label>
    <input value = {newItem} 
    onChange={e =>setNweItem(e.target.value)}
    type="text" id="item"/>
  </div>
  <button className="btn">add</button>
  </form>
  <h1 className="header"> to do list</h1>
  <ul className="list ">
    <li> 
      <label>
        <input type="checkbox" />
        item1
      </label>
      <button className="btn btn_danger"> delete </button>
      </li>
      <li>
      <label>
        <input type="checkbox" />
        item2
      </label>
      <button className="btn btn_danger"> delete </button>
      </li>
    
    
  </ul>
  </>

  )
}


