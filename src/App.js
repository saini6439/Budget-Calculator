import React, {useState, useEffect} from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Alert from './components/Alert';
import {v4 as uuid} from "uuid"; 

const initialExpenses= localStorage.getItem("expenses") ? JSON.parse(localStorage.getItem("expenses")): [];

function App() {

  // *********************** State Values *****************
  const [expenses,setExpenses]=useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert]  = useState({show:false});
  const [edit, SetEdt] = useState(false);
  const [id, setId] = useState(0);

  //********************* useEffect **********************
  useEffect(() => {
    localStorage.setItem("expenses",JSON.stringify(expenses));
  },[expenses]);

  // ****************** functionality **********************
  const handleCharge = e => {
    setCharge(e.target.value);
  };
  const handleAmount = e => {
    setAmount(e.target.value);
  };

  const handleAlert = ({type, text}) =>{
    setAlert({show:true, type, text});
    setTimeout(()=>{
      setAlert({show:false});
    },3000);  
  };

  const handleSubmit = e => {
    e.preventDefault();
    if(charge !== "" && amount > 0)
    {
      if(edit){
        let tempExpenses = expenses.map(item => {
         console.log(item.id,id)
          return item.id === id ? {...item, charge, amount} : item;
        });
        console.log(tempExpenses)
        setExpenses(tempExpenses);
        SetEdt(false);
        handleAlert({type: "success", text: "item Edited"});
      }
      
      else{
        const singleExpense = { id: uuid(), charge, amount }
        setExpenses([...expenses, singleExpense]);
        handleAlert({type: "success", text: "item added"});
      }
      setCharge("");
      setAmount("");
    }
     else{
      handleAlert({type: "danger", text: "fields are empty item can't added"});
     }
  }

  const clearItems = () =>  {
    handleAlert({type: "danger", text: "item cleared"});
        setExpenses([])
  }

  const handleDelete = id => {
   let tempExpenses = expenses.filter(item => item.id !== id);
   setExpenses(tempExpenses);
   handleAlert({type:"danger", text:"item deleted"});
  }

  const handleEdit = id => {
    let expense = expenses.find(item => item.id === id);
    let{charge,amount} = expense;
    console.log(charge,amount,id);
    setCharge(charge);
    setAmount(amount);
    SetEdt(true);
    setId(id);
  }

  return (
    <>
    {alert.show && <Alert type={alert.type} text={alert.text}/>}
    <h1>budget calculator</h1>
    <main className="App">
      <ExpenseForm
      charge={charge}
      amount={amount}
      handleCharge={handleCharge}
      handleAmount={handleAmount}
      handleSubmit={handleSubmit}
      edit={edit}
      /> 
      <ExpenseList 
      expenses={expenses}
      handleDelete={handleDelete}
      handleEdit={handleEdit}
      clearItems={clearItems}
      />
    </main>
    <h1>
      total spending : {" "}
      <span className="total">
      $ {expenses.reduce((acc,curr) =>{
        return (acc += parseInt(curr.amount));
      }, 0)}
      </span>
    </h1>
    </>
  );
}

export default App;