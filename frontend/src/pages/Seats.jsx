import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Seats.css';

const Seats = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showId, isAuthenticated]);

  const fetchShow = async () => {
    try {
      const response = await showsAPI.getShowById(showId);
      setShow(response.data.data);
    } catch (error) {
      console.error('Error fetching show:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsConfig = [
      { leftSeats: 3, middleSeats: 6, rightSeats: 3 }, // Row A - 12 seats
      { leftSeats: 3, middleSeats: 6, rightSeats: 3 }, // Row B - 12 seats
      { leftSeats: 4, middleSeats: 8, rightSeats: 4 }, // Row C - 16 seats
      { leftSeats: 4, middleSeats: 8, rightSeats: 4 }, // Row D - 16 seats
      { leftSeats: 5, middleSeats: 8, rightSeats: 5 }, // Row E - 18 seats
      { leftSeats: 5, middleSeats: 8, rightSeats: 5 }, // Row F - 18 seats
      { leftSeats: 5, middleSeats: 10, rightSeats: 5 }, // Row G - 20 seats
      { leftSeats: 5, middleSeats: 10, rightSeats: 5 }, // Row H - 20 seats
      { leftSeats: 6, middleSeats: 10, rightSeats: 6 }, // Row I - 22 seats
      { leftSeats: 6, middleSeats: 10, rightSeats: 6 }, // Row J - 22 seats
    ];

    return rows.map((row, rowIndex) => {
      const config = seatsConfig[rowIndex];
      const rowSeats = {
        row,
        left: [],
        middle: [],
        right: []
      };

      let seatCounter = 1;

      // Generate left section seats
      for (let i = 0; i < config.leftSeats; i++) {
        const seatNum = seatCounter;
        const seatId = `${row}${seatNum}`;
        rowSeats.left.push({
          row,
          number: seatNum,
          seatNumber: seatId,
          isBooked: show?.bookedSeats?.some(s => s.seatNumber === seatId) || false
        });
        seatCounter++;
      }

      // Generate middle section seats
      for (let i = 0; i < config.middleSeats; i++) {
        const seatNum = seatCounter;
        const seatId = `${row}${seatNum}`;
        rowSeats.middle.push({
          row,
          number: seatNum,
          seatNumber: seatId,
          isBooked: show?.bookedSeats?.some(s => s.seatNumber === seatId) || false
        });
        seatCounter++;
      }

      // Generate right section seats
      for (let i = 0; i < config.rightSeats; i++) {
        const seatNum = seatCounter;
        const seatId = `${row}${seatNum}`;
        rowSeats.right.push({
          row,
          number: seatNum,
          seatNumber: seatId,
          isBooked: show?.bookedSeats?.some(s => s.seatNumber === seatId) || false
        });
        seatCounter++;
      }

      return rowSeats;
    });
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return;

    const seatId = seat.seatNumber;
    if (selectedSeats.some(s => s.seatNumber === seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, { seatNumber: seat.seatNumber, row: seat.row }]);
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    navigate('/summary', { 
      state: { 
        show, 
        selectedSeats,
        totalAmount: selectedSeats.length * show.price
      } 
    });
  };

  if (loading) return <div className="seats-loading">Loading...</div>;
  if (!show) return <div className="seats-error">Show not found</div>;

  const seatsData = generateSeats();

  return (
    <div className="seats-page">
      <div className="seats-container">
        <div className="seats-header">
          <h2>{show.movie?.title}</h2>
          <p className="show-details">
            {new Date(show.showDate).toLocaleDateString()} | {show.showTime} | Screen {show.screen}
          </p>
        </div>

        <div className="screen-wrapper">
          <div className="screen">SCREEN</div>
        </div>

        <div className="seats-grid">
          {seatsData.map(rowData => (
            <div key={rowData.row} className="seat-row">
              <span className="row-label">{rowData.row}</span>
              
              {/* Left Section */}
              <div className="seats-section">
                {rowData.left.map(seat => (
                  <button
                    key={seat.seatNumber}
                    className={`seat ${
                      seat.isBooked ? 'booked' : 
                      selectedSeats.some(s => s.seatNumber === seat.seatNumber) ? 'selected' : 'available'
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              {/* Aisle */}
              <div className="aisle"></div>

              {/* Middle Section */}
              <div className="seats-section">
                {rowData.middle.map(seat => (
                  <button
                    key={seat.seatNumber}
                    className={`seat ${
                      seat.isBooked ? 'booked' : 
                      selectedSeats.some(s => s.seatNumber === seat.seatNumber) ? 'selected' : 'available'
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              {/* Aisle */}
              <div className="aisle"></div>

              {/* Right Section */}
              <div className="seats-section">
                {rowData.right.map(seat => (
                  <button
                    key={seat.seatNumber}
                    className={`seat ${
                      seat.isBooked ? 'booked' : 
                      selectedSeats.some(s => s.seatNumber === seat.seatNumber) ? 'selected' : 'available'
                    }`}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                  >
                    {seat.number}
                  </button>
                ))}
              </div>

              <span className="row-label row-label-right">{rowData.row}</span>
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="legend-box available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box booked"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="booking-summary">
          <div className="summary-info">
            <div className="selected-seats-info">
              <span className="info-label">Selected Seats:</span>
              <span className="info-value">
                {selectedSeats.map(s => s.seatNumber).join(', ') || 'None'}
              </span>
            </div>
            <div className="total-amount">
              <span className="amount-label">Total Amount:</span>
              <span className="amount-value">Rs. {selectedSeats.length * show.price}</span>
            </div>
          </div>
          <button 
            className="btn-continue" 
            onClick={handleContinue}
            disabled={selectedSeats.length === 0}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Seats;