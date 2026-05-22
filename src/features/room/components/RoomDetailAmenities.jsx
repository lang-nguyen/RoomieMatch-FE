const iconMap = {
  'Giường ngủ 1.4 x 2.0m': '🛏️',
  'Tủ quần áo âm tường': '🧥',
  'Bàn học / làm việc': '🪑',
  'Điều hòa inverter': '❄️',
  'Bình nóng lạnh': '🚿',
  'Máy giặt chung (miễn phí)': '🧺',
  'Wi-Fi cáp quang': '📶',
  'Camera an ninh 24/7': '📹',
  'Chỗ để xe có mái che': '🏍️'
};

const RoomDetailAmenities = ({ items }) => {
  return (
    <section className="room-detail-section">
      <h2 className="room-detail-section-title">Tiện ích sẵn có</h2>
      <div className="room-detail-amenities">
        {items.map((item) => (
          <div key={item} className="room-detail-amenity">
            <span className="room-detail-amenity-icon">{iconMap[item] || '✅'}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RoomDetailAmenities;
