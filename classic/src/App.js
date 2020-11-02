import React from 'react';
import './App.css';

function App() {

  class TodoApp extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        todos:[
          {
            id: "1",
            title: "吃饭",
            completed: true
          },
          {
            id: "2",
            title: "睡觉",
            completed: false
          }
        ],
        editedTodo: null,
        remaining:0
      }
      this.addTodo = this.addTodo.bind(this);
      this.removeTodo = this.removeTodo.bind(this);
      this.editTodo = this.editTodo.bind(this);
      this.doneEdit = this.doneEdit.bind(this);
      this.toggleTodoCompleted = this.toggleTodoCompleted.bind(this);
      this.cancelEdit = this.cancelEdit.bind(this);
      this.removeCompleted = this.removeCompleted.bind(this);
      this.allDone = this.allDone.bind(this);
    }

    addTodo(value) {
      this.setState({ todos: [...this.state.todos,{
        id: this.state.todos.length + 1,
        title: value,
        completed: false
      }]})
    }

    removeTodo(todo) {
      this.setState({ todos:this.state.todos.filter(item => item.id!== todo.id)})
    }
    
    editTodo(todo) {
      this.setState({ editedTodo:todo})
    }
    
    doneEdit(e,todo){
      if (!this.state.editedTodo) {
        return;
      }
      
      if(!todo.title.trim()){
        this.removeTodo(todo)
      }else{
        this.setState({ todos: this.state.todos.map(item=>{
          if(item.id === todo.id ){
              return {
                ...item,
                title:todo.title.trim()
              }
          }else{
            return item
          }
        })})
      }

      this.setState({ editedTodo:null})
    }

    toggleTodoCompleted(todo){
      this.setState({ todos: this.state.todos.map( item=>{
        if(item.id === todo.id ){
          return {
            ...item,
            completed:!todo.completed
          }
        }else{
          return item
        }
      })})
    }

    cancelEdit(){
      this.setState({ editedTodo:null})
    }
    
    removeCompleted(){
      this.setState({ todos:this.state.todos.filter(item => !item.completed)})
    }

    allDone(value){
      this.setState({todos:this.state.todos.map(todo=> {
        return {...todo,completed:value}
      })})
    }

    render() {
      return (
        <div className="todoapp">
          <header className="header">
            <h1>React todos</h1>
            <NewTodoInput addTodo={this.addTodo}></NewTodoInput>
          </header>
            <TodoList
              data={this.state.todos}
              removeTodo={this.removeTodo}
              editTodo={this.editTodo}
              editedTodo={this.state.editedTodo}
              doneEdit={this.doneEdit}
              toggleTodoCompleted={this.toggleTodoCompleted}
              cancelEdit={this.cancelEdit}
              allDone={this.allDone}></TodoList>
              <footer className="footer" style={{display:this.state.todos.length? '':'none'}}>
                <span className="todo-count">
                <strong>{this.state.todos.filter(todo => !todo.completed).length} </strong>  left
                </span>
                <button className="clear-completed" onClick={this.removeCompleted}>
                  Clear completed
                </button>
              </footer>
        </div>
      );
    }
  }

  class NewTodoInput extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        value: ''
      };
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
      this.setState({value: event.target.value});
    }
  
    handleSubmit(event) {
      event.keyCode === 13 && ( this.props.addTodo(this.state.value) || this.setState({value: ''}))
    }

    render() {
      return (
        <div>
          <input className="new-todo"
            value={this.state.value}
            onChange={this.handleChange}
            placeholder="What needs to be done?" 
            onKeyDown={this.handleSubmit}/>
        </div>
      );
    }
  }

  class TodoList extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        editingValue : ''
      }
    }
    render() {
      return (
        <section className='main'>
          <input className="toggle-all" type="checkbox" checked={this.props.data.every(item=>item.completed)} onChange={ e=>this.props.allDone(e.target.checked)}/>
          <ul className='todo-list'>
            {this.props.data.map((item) =>
              <li key={item.id} className={ ["todo",item.completed ? "completed": "", item === this.props.editedTodo ? "editing" : ""].join(' ') }>
                <div className='view'>
                  <input className='toggle' type="checkbox" checked={item.completed} onChange={ _=>this.props.toggleTodoCompleted(item)}></input>
                  <label 
                  onClick={ _=>{
                    this.setState({editingValue: item.title})
                    this.props.editTodo(item)
                  }}>{item.title}</label>
                  <button className="destroy" onClick={ _=>{
                    this.props.removeTodo(item)
                  }}></button>
                </div>
                <input className="edit" type="text"
                  value={this.state.editingValue}
                  onChange= { e=>{
                    this.setState({editingValue: e.target.value})
                  }}
                  onKeyDown={ e =>{
                    e.keyCode === 13 && this.props.doneEdit(e,Object.assign({},item,{title:this.state.editingValue}))
                    e.keyCode === 13 && this.setState({editingValue:''})
                    e.keyCode === 27 && this.props.cancelEdit()
                  }} />
              </li>
            )}
          </ul>
        </section>
      );
    }
  }

  return (
    <TodoApp></TodoApp>
  );
}

export default App;
