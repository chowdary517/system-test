import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  Table,
  Tag,
  Button,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from 'antd';
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  UndoOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import Priorities from './../constants/Priorities';
import Colors from './../constants/Colors';

import {
  deleteTask,
  updateAction,
  updateTask,
  getSortedTasks,
} from './../state-management/actions';

class TableWrapped extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedItem: {
        summary: '',
        description: '',
        dueDate: null,
        priority: 0,
        key: '',
      },
      editMode: false,
      filteredTasks: props.data,
    };

    this.confirm = this.confirm.bind(this);
    this.updateAction = this.updateAction.bind(this);
  }

  confirm = async (key) => {
    await this.props.deleteTask(key);
    message.success('Task has been deleted!');
  };

  updateAction = async (key) => {
    await this.props.updateAction(key);
    message.success('Task has been updated');
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  onFinish = async (values) => {
    const payload = {
      ...values,
      key: this.state.selectedItem.key,
      dueDate: values.dueDate.utc().format('YYYY-MM-DD'),
    };
    await this.props.updateTask(payload);
    this.handleCancel();
    message.success('Task has been updated!');
  };

  onView = (key, editMode) => {
    const { tasks } = this.props;

    const task = _.find(tasks, function (task) {
      return task.key === key;
    });

    this.setState({
      visible: true,
      selectedItem: task,
      editMode,
    });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.getSortedTasks(sorter);
  };

  render() {
    const { Option } = Select;
    const { selectedItem, editMode } = this.state;
    const { summary, dueDate, priority, description } = selectedItem;

    const columns = [
      {
        title: 'Summary',
        dataIndex: 'summary',
        key: 'summary',
        render: (summary, { isDone }) => {
          if (isDone) {
            return <span className='completed'>{summary}</span>;
          } else {
            return <span className='pending'>{summary}</span>;
          }
        },
        ellipsis: true,
        sorter: true,
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        render: (priority) => (
          <Tag color={Colors[priority]}>
            {Priorities[priority].toUpperCase()}
          </Tag>
        ),
        width: 150,
        sorter: true,
      },
      {
        title: 'Created Date',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (createdDate, { isDone }) => {
          if (isDone) {
            return <span className='completed'>{createdDate}</span>;
          } else {
            return <span className='pending'>{createdDate}</span>;
          }
        },
        width: 150,
        sorter: true,
      },
      {
        title: 'Due Date',
        dataIndex: 'dueDate',
        key: 'dueDate',
        render: (dueDate, { isDone }) => {
          if (isDone) {
            return <span className='completed'>{dueDate}</span>;
          } else {
            return <span className='pending'>{dueDate}</span>;
          }
        },
        width: 150,
        sorter: true,
      },
      {
        title: 'Actions',
        key: 'actions',
        render: ({ key, isDone }) => (
          <Space>
            <Button size='small' onClick={() => this.onView(key, false)}>
              <EyeOutlined /> View
            </Button>
            <Button
              size='small'
              disabled={isDone}
              onClick={() => this.onView(key, true)}
            >
              <EditOutlined />
              Edit
            </Button>
            {!isDone && (
              <Button size='small' onClick={() => this.updateAction(key)}>
                <CheckOutlined /> Done
              </Button>
            )}
            {isDone && (
              <Button size='small' onClick={() => this.updateAction(key)}>
                <UndoOutlined /> Redo
              </Button>
            )}
            <Popconfirm
              title='Are you sure delete this task?'
              okText='Yes'
              cancelText='Cancel'
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={() => this.confirm(key)}
            >
              <Button type='danger' size='small'>
                <DeleteOutlined /> Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    const config = {
      rules: [
        { type: 'object', required: true, message: 'Due Date is required!' },
      ],
    };

    return (
      <>
        <Table
          columns={columns}
          dataSource={this.props.data}
          pagination={{ position: ['bottomRight'], pageSize: 5 }}
          onChange={this.handleTableChange}
        />
        {this.state.visible && (
          <Modal
            title='Add New Task'
            visible={this.state.visible}
            footer={null}
            onCancel={(e) => this.handleCancel(e)}
          >
            <Form
              layout={'vertical'}
              name='basic'
              initialValues={{
                priority,
                summary,
                description,
                dueDate: new moment(dueDate),
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
                <Input disabled={!editMode} />
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
                <Input.TextArea disabled={!editMode} />
              </Form.Item>
              <Form.Item name='dueDate' label='Due Date' {...config}>
                <DatePicker style={{ width: '100%' }} disabled={!editMode} />
              </Form.Item>
              <Form.Item
                name='priority'
                label='Priority'
                rules={[{ required: true, message: 'Priority is required!' }]}
              >
                <Select
                  placeholder='Select Priority'
                  allowClear
                  disabled={!editMode}
                >
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
                    {editMode && (
                      <Button type='primary' htmlType='submit'>
                        Update Task
                      </Button>
                    )}
                    <Button key='back' onClick={(e) => this.handleCancel(e)}>
                      Cancel
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return { tasks: state.tasks };
};

function mapDispatchToProps(dispatch) {
  return {
    deleteTask: (key) => dispatch(deleteTask(key)),
    updateAction: (key) => dispatch(updateAction(key)),
    updateTask: (task) => dispatch(updateTask(task)),
    getSortedTasks: (sorter) => dispatch(getSortedTasks(sorter)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableWrapped);
