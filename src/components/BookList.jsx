import { Space, Table, Button, Image, Tag, Popconfirm } from 'antd';

export default function BookList(props) {
  const columns = [
    {
      title: 'Cover',
      dataIndex: 'coverUrl',
      key: 'cover',
      render: (text) => (
        // Port 3080 สำหรับรูปภาพตาม Slide 12
        <Image src={`http://localhost:3080${text}`} height={80} />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `$${text}`
    },
    {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        render: (cat) => <Tag color="blue">{cat?.name || 'No Category'}</Tag>
    },
    {
        title: 'Liked',
        dataIndex: 'likeCount',
        key: 'likeCount',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => props.onLiked(record)}>
            Like
          </Button>
          
          {/* ปุ่ม Edit (Assignment) */}
          <Button onClick={() => props.onEdit(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete the book"
            description="Are you sure to delete this book?"
            onConfirm={() => props.onDeleted(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
                Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={props.data} rowKey="id" loading={props.loading} />;
}