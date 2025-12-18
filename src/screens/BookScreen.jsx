import './App.css'
import { useState, useEffect } from 'react';
import { Divider, Spin } from 'antd';
import axios from 'axios'
import BookList from './components/BookList'
import AddBook from './components/AddBook';
import EditBook from './components/EditBook';

const URL_BOOK = "/api/book"
const URL_CATEGORY = "/api/book-category"

function BookScreen() {
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  
  // • สร้าง useState ตัวใหม่สําหรับเก็บข้อมูลของ Item ที่ต้องการ Edit
  // และใช้เป็น flag เปิด/ปิด Modal (null = ปิด, object = เปิด)
  const [editBook, setEditBook] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(URL_CATEGORY);
      setCategories(response.data.map(cat => ({
        label: cat.name,
        value: cat.id
      })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URL_BOOK);
      setBookData(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }

  // • สร้าง function ใหม่ชื่อ updateBook (แทน handleEditBook เดิม)
  const updateBook = async (book) => {
    setLoading(true)
    try {
      // แปลงค่าตัวเลข
      const editedData = {...book, 'price': Number(book.price), 'stock': Number(book.stock)}
      
      // • ข้อควรระวัง!! Backend จะไม่รับค่า id, category, createdAt, updatedAt
      const {id, category, createdAt, updatedAt, ...data} = editedData
      
      // • สั่ง update ด้วย URL: /api/book/<id> และส่ง parameter data ด้วย PATCH
      await axios.patch(`${URL_BOOK}/${id}`, data);
      
      fetchBooks();
    } catch (error) {
      console.error('Error editing book:', error);
    } finally {
      setLoading(false);
      setEditBook(null); // ปิด Modal
    }
  }

  const handleAddBook = async (book) => {
    setLoading(true)
    try {
      await axios.post(URL_BOOK, book);
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleLikeBook = async (book) => {
    try {
      await axios.patch(URL_BOOK + `/${book.id}`, { likeCount: book.likeCount + 1 });
      fetchBooks();
    } catch (error) {
      console.error('Error liking book:', error);
    }
  }

  const handleDeleteBook = async (bookId) => {
    setLoading(true)
    try {
      await axios.delete(URL_BOOK + `/${bookId}`);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchBooks();
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2em" }}>
        <AddBook categories={categories} onBookAdded={handleAddBook}/>
      </div>
      <Divider>My Books List</Divider>
      <Spin spinning={loading}>
        <BookList 
          data={bookData} 
          onLiked={handleLikeBook}
          onDeleted={handleDeleteBook}
          onEdit={book => setEditBook(book)} // เซตข้อมูลเพื่อเปิด Modal
        />
      </Spin>
      
      <EditBook 
        book={editBook} 
        categories={categories} 
        open={editBook !== null} 
        onCancel={() => setEditBook(null)} 
        onSave={updateBook} />
    </>
  )
}

export default BookScreen;