# PinShare - Interactive Map-Based Social Platform

A full-stack web application that allows users to create, share, and discover location-based pins on an interactive map. Users can mark their favorite places, add reviews, and share them with others.

## �� Features

### User Features
- User authentication (Register/Login)
- Personalized pin management
- Filter pins by user
- Secure session management

### Map Features
- Interactive map interface using Leaflet
- Double-click to add new pins
- Custom markers (violet for user's pins, red for others)
- Detailed pin information in popups
- Rating system with stars
- Responsive map controls
- Zoom constraints for better user experience

### Pin Features
- Add title and description
- Rate locations (1-5 stars)
- View creation time
- See creator information
- Filter pins by user

## 🛠️ Technologies Used

### Frontend
- React.js
- Leaflet Maps API
- Material-UI Icons
- Axios for API calls
- CSS3 for styling

### Backend
- Node.js
- Express.js
- MongoDB
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/shreyansh1607/pinshare.git
cd pinshare
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables
```bash
# In backend/.env
PORT=8800
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the application
```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 💻 Usage

1. **Registration/Login**
   - Click "Register" to create a new account
   - Or "Login" if you already have an account

2. **Adding Pins**
   - Double-click anywhere on the map to add a new pin
   - Fill in the title, description, and rating
   - Click "Add Pin" to save

3. **Viewing Pins**
   - Click on any marker to view pin details
   - Use the filter button to show only your pins

4. **Managing Pins**
   - View all pins or filter by user
   - See ratings and reviews
   - Track creation times

## 🔒 Security Features

- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- Input validation
- XSS protection

## 🎨 UI/UX Features

- Responsive design
- Custom marker colors
- Interactive popups
- Smooth animations
- User-friendly forms
- Clear error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Your Name
- GitHub: [shreyansh1607](https://github.com/shreyansh1607)
- LinkedIn: [shreyansh yadav](www.linkedin.com/in/shreyansh-yadav-2b9851246)

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Leaflet.js for the map library
- Material-UI for icons
- All contributors and users of the application

## 📞 Support

For support, please open an issue in the GitHub repository or contact the author.

---

Made with ❤️ by Shreyansh .
