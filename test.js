console.log("smsm")
function dosomething(){

};
//arrow function
const dosomething = () => {

};
 export default function dosomething(){

} ;//readable by other files
//arrow function
export const dosomething = () => {

};
// in react 
const mycomponet = () =>{
    return <div></div>
};
//in javascript
<button onClick={nameofafunction}>
</button>
//inreact 

//<button onClick={()=>{console.log("hello word")}}>
//</button>
let Age=10;
let fname= age>10? "pedro":"jack";
// in react
const newfunction=() =>{
    return age>10? <div>pedro</div>:<div>jack</div>
};
const person= { 
    name:"rim",
    age:20,
    ismarried:true,
};
const name=person.name
const ismarried=person.ismarried
const age=person.age
//or 
//const {name,age,ismarried}=person;
const person2= { 
    fname,//name:fname
    age:20,
    ismarried:true,
};
const person3={...person,name:assad};//exactly the same of person but name different
const names=["rim","assaad","ghid","ghid"]
const names2=[...names,"pedro"]//array names2 is the same of names but add pedro 
//3 important function
.map()
.filter()
.reduce()//not important in react
//if i need to add a number1 at end of each name in table names
//using for loop or using map
names.map((name)=>{
//console.log(name) consol.log each of names
// return "joe" every element in the array will became joe
name + "1"; //append 1 at the end of each element
});
//remove ghid from the list
names.filter( (name)=>{
    return name!=="ghid";
})