import React, { createContext, useContext, useState, useCallback } from 'react';
import { InspectionRequest, Quote, Surveyor, InspectionStatus, SurveyorStatus } from '@/types';
import { mockInspections, mockQuotes, mockSurveyors } from '@/data/mockData';

interface DataContextType {
  inspections: InspectionRequest[];
  quotes: Quote[];
  surveyors: Surveyor[];
  addInspection: (inspection: Omit<InspectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateInspectionStatus: (id: string, status: InspectionStatus) => void;
  assignSurveyor: (inspectionId: string, surveyorId: string) => void;
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'status'>) => void;
  updateQuoteStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  updateSurveyorStatus: (id: string, status: SurveyorStatus) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inspections, setInspections] = useState<InspectionRequest[]>(mockInspections);
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [surveyors, setSurveyors] = useState<Surveyor[]>(mockSurveyors);

  const addInspection = useCallback((data: Omit<InspectionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newInspection: InspectionRequest = {
      ...data,
      id: `INS-${String(Date.now()).slice(-4)}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInspections(prev => [newInspection, ...prev]);
  }, []);

  const updateInspectionStatus = useCallback((id: string, status: InspectionStatus) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  }, []);

  const assignSurveyor = useCallback((inspectionId: string, surveyorId: string) => {
    setInspections(prev => prev.map(i =>
      i.id === inspectionId ? { ...i, surveyorId, status: 'Surveyor Assigned' as InspectionStatus } : i
    ));
  }, []);

  const addQuote = useCallback((data: Omit<Quote, 'id' | 'createdAt' | 'status'>) => {
    const newQuote: Quote = {
      ...data,
      id: `QT-${String(Date.now()).slice(-4)}`,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setQuotes(prev => [newQuote, ...prev]);
    setInspections(prev => prev.map(i =>
      i.id === data.requestId ? { ...i, status: 'Quote Sent' as InspectionStatus, quoteId: newQuote.id } : i
    ));
  }, []);

  const updateQuoteStatus = useCallback((id: string, status: 'Approved' | 'Rejected') => {
    setQuotes(prev => prev.map(q => q.id === id ? { ...q, status } : q));
    if (status === 'Approved') {
      const quote = quotes.find(q => q.id === id);
      if (quote) {
        setInspections(prev => prev.map(i =>
          i.id === quote.requestId ? { ...i, status: 'Quote Approved' as InspectionStatus } : i
        ));
      }
    }
  }, [quotes]);

  const updateSurveyorStatus = useCallback((id: string, status: SurveyorStatus) => {
    setSurveyors(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  }, []);

  return (
    <DataContext.Provider value={{
      inspections, quotes, surveyors,
      addInspection, updateInspectionStatus, assignSurveyor,
      addQuote, updateQuoteStatus, updateSurveyorStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
};
