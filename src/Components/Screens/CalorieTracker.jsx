import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faMinus, } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import BackgroundVedio from '../../Assets/calorie calculator stats animation tubik.mp4'

function CalorieTracker() {
    const [nutritionItems, setNutritionItems] = useState([]);
    const [newItem, setNewItem] = useState({name: "", calories: "", protein: "", carbs: "", fat: "",});
    const [editItem, setEditItem] = useState(null);
    const [totalCalories, setTotalCalories] = useState(0);
    const [itemsExist, setItemsExist] = useState(false); 

    const validateInputs = (item) => {
        return (
            item.name.trim() !== "" &&
            parseFloat(item.calories) >= 0 &&
            parseFloat(item.protein) >= 0 &&
            parseFloat(item.carbs) >= 0 &&
            parseFloat(item.fat) >= 0
        );
    };
    //Item validation of input field.....

    const resetInputFields = () => {
        setNewItem({
            name: "",
            calories: "",
            protein: "",
            carbs: "",
            fat: "",
        });
    }
    //when user submit the button after the input field will be reseted...

    const addNutritionItem = () => {
        const anyEmptyField = Object.values(newItem).some(value => !value.trim());
        if (anyEmptyField) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill out all the input fields!',
            });
            return; 
        }
        //Sweetalert - if the input field is empty the user clicks the add item button shows this sweetalert popup...
        
        if (validateInputs(newItem)) {
            setNutritionItems([
                ...nutritionItems, { ...newItem, id: Date.now(), quantity: 1 },
            ]); //adding a new item
            resetInputFields(); //reseting the input fields after the updation
        }
    };

    const removeAllItems = () => {
        setNutritionItems([]);
    };
    //when user clicks the clear all button the all calorie card items will be removed...

    const updateItemQuantity = (id, change) => {
        const updatedItems = nutritionItems.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(item.quantity + change, 1) } : item
        );
        setNutritionItems(updatedItems);
    };
    //when user click the add or minus buttons the items quantity will be changed...

    const editItemFunction = (item) => {
        setEditItem(item.id);
        setNewItem({ ...item });
    };
    //when user clicks the edit item button its appear the current card to edit

    const updateItemFunction = () => {
        if (validateInputs(newItem)) {
            const updatedItems = nutritionItems.map((item) =>
                item.id === newItem.id ? newItem : item
            );
            setNutritionItems(updatedItems);
            resetInputFields();
            setEditItem(null);
        }
    };
    //when user clicks the edit button the add item will be changed to edit and update item

    const deleteItemFunction = (id) => {
        const updatedItems = nutritionItems.filter((item) => item.id !== id);
        setNutritionItems(updatedItems);
        if (editItem === id) {
            setEditItem(null);
        }
    };
    //when user click the card delete button the card will be deleted..

    useEffect(() => {
        const calculateTotalCalories = nutritionItems.reduce(
            (total, item) => total + parseFloat(item.calories) * item.quantity, 0
        );
        setTotalCalories(calculateTotalCalories);
        setItemsExist(nutritionItems.length > 0);
    }, [nutritionItems]);
    //It shows the total calorie that consuming..

    const totalProtein = () => {
        return nutritionItems.reduce(
            (total, item) => total + parseFloat(item.protein) * item.quantity,
            0
        );
    };
    //It displays the total protein that consuming from all the components....

    const totalCarbs = () => {
        return nutritionItems.reduce(
            (total, item) => total + parseFloat(item.carbs) * item.quantity,
            0
        );
    };
    //It displays the total carbs that consuming from all the components....

    const totalFat = () => {
        return nutritionItems.reduce(
            (total, item) => total + parseFloat(item.fat) * item.quantity,
            0
        );
    };
    //It displays the total fat that consuming from all the components....

    return (
        <section className={`calorieTracker ${!itemsExist ? "empty" : ""}`}>
             <video autoPlay muted loop className="background-video">
                <source src={BackgroundVedio} type="video/mp4" />
            </video>
            <div className="container">
                <h1 className="heading">Calorie Tracker Meter</h1>
                <div className="iteminput">
                <input
                    type='text'
                    placeholder='Item Name'
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                />
                <input
                    type='number'
                    placeholder='Calories'
                    value={newItem.calories}
                    onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                    min="0"
                    required
                />
                <input
                    type='number'
                    placeholder='Protein (g)'
                    value={newItem.protein}
                    onChange={(e) => setNewItem({ ...newItem, protein: e.target.value })}
                    min="0"
                    required
                />
                <input
                    type='number'
                    placeholder='Carbs (g)'
                    value={newItem.carbs}
                    onChange={(e) => setNewItem({ ...newItem, carbs: e.target.value })}
                    min="0"
                    required
                />
                <input
                    type='number'
                    placeholder='Fat (g)'
                    value={newItem.fat}
                    onChange={(e) => setNewItem({ ...newItem, fat: e.target.value })}
                    min="0"
                    required
                />
                </div>
                <div className="buttons">
                    {editItem ? (
                        <button onClick={updateItemFunction}>Update Item</button>
                    ) : (
                        <button className='green' onClick={addNutritionItem}>Add Item</button>
                    )}
                    <button className='red' onClick={removeAllItems}>Clear All</button>
                </div>
                {nutritionItems.length > 0 && (
                    <div className="cardItems">
                        {nutritionItems.map((item) => (
                            <div key={item.id} className='cardwrapper'>
                                <h2>{item.name}</h2>
                                <ul>
                                    <li>Calories: {item.calories * item.quantity}</li>
                                    <li>Protein: {item.protein * item.quantity}g</li>
                                    <li>Carbs: {item.carbs * item.quantity}g</li>
                                    <li>Fat: {item.fat * item.quantity}g</li>
                                </ul>
                                <div className="cardbuttons">
                                    <button className='plus' onClick={() => updateItemQuantity(item.id, 1)}><FontAwesomeIcon icon={faPlus}/></button>
                                    <span>{item.quantity}</span> 
                                    <button className='minus' onClick={() => updateItemQuantity(item.id, -1)}><FontAwesomeIcon icon={faMinus}/> </button>
                                    <button className='edit' onClick={() => editItemFunction(item)}><FontAwesomeIcon icon={faEdit}/> Edit </button>
                                    <button className='delete' onClick={() => deleteItemFunction(item.id)}> <FontAwesomeIcon icon={faTrashAlt}/> Delete </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="caloriesCount">
                    <h4>Total Calories: {totalCalories}</h4>
                    <h4>Total Protein: {totalProtein()}g</h4>
                    <h4>Total Carbs: {totalCarbs()}g</h4>
                    <h4>Total Fat: {totalFat()}g</h4>
                </div>
            </div>
        </section>
    );
}

export default CalorieTracker;
