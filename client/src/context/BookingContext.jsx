import React, { createContext, useState, useMemo } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const value = useMemo(
    () => ({
      selectedWorker,
      selectedService,
      selectedBooking,
      setSelectedWorker,
      setSelectedService,
      setSelectedBooking,
      clearSelection: () => {
        setSelectedWorker(null);
        setSelectedService(null);
        setSelectedBooking(null);
      },
    }),
    [selectedWorker, selectedService, selectedBooking],
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};
