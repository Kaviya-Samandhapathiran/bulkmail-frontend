import { useState } from 'react'
import './App.css'
import axios from "axios"
import * as XLSX from "xlsx"

function App() {
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist, setemaillist] = useState([])

  function handlemsg(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(evt) {
    const file = evt.target.files[0]

    const reader = new FileReader()

    reader.onload = function (evt) {
      const data = evt.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetname = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetname]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalmail = emailList.map(function (item) {
        return item.A
      })
      console.log(totalmail)
      setemaillist(totalmail)
    }
    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true)
    axios.post("https://bulkmail-backend-liart.vercel.app/sendmail", { msg: msg, emaillist:emaillist })
      .then(
        function (data) {
          if (data.data === true) {
            alert("Email Sent Successfully")
            setstatus(false)
          }
          else {
            alert("Failed")
            setstatus(false)
          }
        }
      )
  }

  return (
    <div className='bg-[#DE1E73] p-4 m-6 font-sans text-center text-white rounded-md'>
      <div className='bg-[#0A1227] text-center rounded-lg'>
        <h1 className='text-white text-4xl font-medium px-5 py-3'>Bulk Mail📧</h1>
        <h1 className='text-xl text-amber-300 font-medium px-5 py-3'>We can help your business with sending multiple emails at once</h1>
        <div className='text-center flex flex-col items-center gap-5 my-4'>
          <h1 className='text-xl font-medium text-white'>Drag and Drop your mail👇</h1>
          <textarea onChange={handlemsg} value={msg} className='bg-white outline-none w-[70%] h-50 p-2 border border-black rounded-md text-black' placeholder='Enter the Email text..'></textarea>
          <div className='flex justify-center items-center pl-30'>
            <span className='text-3xl'>📂</span>
            <input type="file" className='text-white text-xl cursor-pointer' onChange={handlefile}></input>
          </div>
        </div>
        <p className='text-xl'>Total emails in the file: {emaillist.length}</p>
        <button onClick={send} className='text-xl bg-green-700 cursor-pointer text-white p-2 my-3 rounded-md'>{status ? "Sending..." : "Send"}</button>
      </div>
    </div>
  )
}

export default App
