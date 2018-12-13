import React from 'react';
import { Card, Table, Badge, Form, Button } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { taskStatus } from '@/constants';
import TaskAddModal from './TaskAddModal';

const FormItem = Form.Item;

@connect(({ task }) => ({
  task,
}))
class TaskLists extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: '任务名称',
        dataIndex: 'name',
        render: (record, obj) => <Link to={`/github/list/?taskId=${obj.id}`}>{record}</Link>,
      },
      {
        title: '关键词',
        dataIndex: 'keywords',
      },
      {
        title: '爬取页数',
        dataIndex: 'pages',
      },
      {
        title: '爬取间隔',
        dataIndex: 'interval',
        render: record => `${record}分钟`,
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: record => {
          switch (taskStatus[record]) {
            case '等待中':
              return <Badge status="default" text={taskStatus[record]} />;
            case '运行中':
              return <Badge status="processing" text={taskStatus[record]} />;
            default:
              return <Badge status="success" text={taskStatus[record]} />;
          }
        },
      },
      {
        title: '开始时间',
        dataIndex: 'start_time',
      },
      {
        title: '完成时间',
        dataIndex: 'finished_time',
      },
      {
        title: '操作',
        key: 'action',
        render: obj => (
          <span>
            <TaskAddModal data={obj} onOk={this.editTaskHandler}>
              <a>编辑</a>
            </TaskAddModal>
          </span>
        ),
      },
    ];
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTasks',
      payload: {
        page: 1,
        pageSize: 10,
      },
    });
  }

  changePage = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/fetchTasks',
      payload: {
        page,
        pageSize: 10,
      },
    });
  };

  createTaskHandler = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/createTasks',
      payload: values,
    });
  };

  editTaskHandler = (id, values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/editTask',
      id,
      payload: values,
    });
  };

  render() {
    const { task } = this.props;

    return (
      <div>
        <Card bordered={false}>
          <Form>
            <FormItem>
              <TaskAddModal onOk={this.createTaskHandler}>
                <Button type="primary">添加任务</Button>
              </TaskAddModal>
            </FormItem>
          </Form>
          <Table
            columns={this.columns}
            dataSource={task.tasks}
            rowKey="id"
            pagination={{
              current: task.page,
              total: task.total,
              onChange: this.changePage,
            }}
          />
        </Card>
      </div>
    );
  }
}

export default TaskLists;
