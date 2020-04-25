import React from 'react';
import { connect } from 'react-redux';
import {
  Tabs,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
  message,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import uuid from 'react-uuid';
import TableWrapped from './TableWrapped';
import { PlusOutlined } from '@ant-design/icons';

import { addTask } from './../state-management/actions';

class ToDoList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };

    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
      initialValues: {
        priority: 0,
      },
    });
  };

  onFinish = async (values) => {
    const payload = {
      ...values,
      key: uuid(),
      isDone: false,
      dueDate: values.dueDate.utc().format('YYYY-MM-DD'),
      createdDate: new moment().utc().format('YYYY-MM-DD'),
    };
    await this.props.addTask(payload);
    this.handleCancel();
    message.success('Task has been added!');
  };

  render() {
    const { TabPane } = Tabs;
    const { Option } = Select;
    const { visible } = this.state;
    const { tasks } = this.props;

    const formItemLayout = null;
    const config = {
      rules: [
        { type: 'object', required: true, message: 'Due Date is required!' },
      ],
    };

    const pending = _.filter(tasks, ['isDone', false]);
    const completed = _.filter(tasks, ['isDone', true]);

    return (
      <>
        <Row>
          <Col span={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '30px' }}>{tasks.length}</span> Total
                Tasks
              </div>
            </Card>
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '30px' }}>{pending.length}</span>{' '}
                Pending Tasks
              </div>
            </Card>
          </Col>
          <Col span={1} />
          <Col span={6}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '30px' }}>{completed.length}</span>{' '}
                Completed Tasks
              </div>
            </Card>
          </Col>
          <Col span={4}>
            <div className='add-task'>
              <Button type='primary' onClick={() => this.showModal()}>
                <PlusOutlined /> Add New Task
              </Button>
            </div>
          </Col>
        </Row>
        <Tabs defaultActiveKey='1'>
          <TabPane tab='All Tasks' key='1'>
            <TableWrapped data={tasks} />
          </TabPane>
          <TabPane tab='Pending Tasks' key='2'>
            <TableWrapped data={pending} />
          </TabPane>
          <TabPane tab='Completed Tasks' key='3'>
            <TableWrapped data={completed} />
          </TabPane>
        </Tabs>
        <Modal
          title='Add New Task'
          visible={visible}
          footer={null}
          onCancel={(e) => this.handleCancel(e)}
        >
          <Form
            {...formItemLayout}
            layout={'vertical'}
            name='basic'
            initialValues={{
              priority: 0,
            }}
            onFinish={(values) => this.onFinish(values)}
          >
            <Form.Item
              label='Summary'
              name='summary'
              rules={[
                {
                  required: true,
                  message: 'Summary is required!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='description'
              label='Description'
              rules={[
                {
                  required: true,
                  message: 'Description is required!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name='dueDate' label='Due Date' {...config}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name='priority'
              label='Priority'
              rules={[{ required: true, message: 'Priority is required!' }]}
            >
              <Select placeholder='Select Priority' allowClear>
                <Option value={0}>None</Option>
                <Option value={1}>Low</Option>
                <Option value={2}>Medium</Option>
                <Option value={3}>High</Option>
              </Select>
            </Form.Item>
            <Row>
              <Col
                span={24}
                style={{
                  textAlign: 'right',
                }}
              >
                <Space>
                  <Button type='primary' htmlType='submit'>
                    Add Task
                  </Button>
                  <Button key='back' onClick={(e) => this.handleCancel(e)}>
                    Cancel
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  };
};

function mapDispatchToProps(dispatch) {
  return {
    addTask: (task) => dispatch(addTask(task)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ToDoList);
