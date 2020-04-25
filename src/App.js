import React from 'react';
import { Layout } from 'antd';
import { Provider } from 'react-redux';
import ToDoList from './components/ToDoList';
// import NoItems from './components/NoItems';

import configureStore from './state-management/store';

import 'antd/dist/antd.css';
import './App.css';

function App() {
  const { Header, Content, Footer } = Layout;

  return (
    <Layout className='layout'>
      <Header>
        <h2 className='app-title'>TO DO LIST APPLICATION</h2>
      </Header>
      <Content style={{ padding: '20px 50px' }}>
        <Provider store={configureStore()}>
          <ToDoList />
        </Provider>
      </Content>
      <Footer
        className='footer'
        style={{
          textAlign: 'center',
          position: 'fixed',
          bottom: '0',
          width: '100%',
        }}
      >
        Developed with smile :) by HARIPRASAD KORAPATI
      </Footer>
    </Layout>
  );
}

export default App;
