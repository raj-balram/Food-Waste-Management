const NotificationToast = ({ message }) => {
  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
      {message}
    </div>
  );
};

export default NotificationToast;