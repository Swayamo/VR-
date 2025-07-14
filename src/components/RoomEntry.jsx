import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function RoomEntry() {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const handleJoinRoom = (e) => {
    e.preventDefault()
    if (roomId.trim() && username.trim()) {
      navigate(`/${roomId}?username=${encodeURIComponent(username)}`)
    }
  }

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomId(newRoomId)
  }

  return (
    <div className="room-entry">
      <div className="room-entry-container">
        <h1>VR Walmart Experience</h1>
        <p>Enter a room to shop with friends!</p>
        
        <form onSubmit={handleJoinRoom}>
          <div className="form-group">
            <label htmlFor="username">Your Name:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="roomId">Room Code:</label>
            <div className="room-input-group">
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                required
              />
              <button type="button" onClick={handleCreateRoom} className="create-room-btn">
                Create New Room
              </button>
            </div>
          </div>
          
          <button type="submit" className="join-room-btn">
            Join Room
          </button>
        </form>
        
        <div className="features">
          <h3>Features:</h3>
          <ul>
            <li>🛒 Shared shopping cart</li>
            <li>👥 See other users in real-time</li>
            <li>🗣️ Voice chat (coming soon)</li>
            <li>📱 Cross-platform compatible</li>
          </ul>
        </div>
      </div>
      
      <style jsx>{`
        .room-entry {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0071dc 0%, #004f9a 100%);
          padding: 20px;
        }
        
        .room-entry-container {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
        }
        
        h1 {
          color: #0071dc;
          text-align: center;
          margin-bottom: 10px;
        }
        
        p {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        }
        
        input {
          width: 100%;
          padding: 12px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.3s;
        }
        
        input:focus {
          outline: none;
          border-color: #0071dc;
        }
        
        .room-input-group {
          display: flex;
          gap: 10px;
        }
        
        .room-input-group input {
          flex: 1;
        }
        
        .create-room-btn {
          background: #ffc220;
          color: #0071dc;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          white-space: nowrap;
        }
        
        .create-room-btn:hover {
          background: #e6ae1d;
        }
        
        .join-room-btn {
          width: 100%;
          background: #0071dc;
          color: white;
          border: none;
          padding: 15px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .join-room-btn:hover {
          background: #005bb2;
        }
        
        .features {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
        }
        
        .features h3 {
          color: #0071dc;
          margin-bottom: 10px;
        }
        
        .features ul {
          list-style: none;
          padding: 0;
        }
        
        .features li {
          padding: 5px 0;
          color: #666;
        }
      `}</style>
    </div>
  )
}
