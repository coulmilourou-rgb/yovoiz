// Type definitions pour jspdf-autotable
declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';

  interface UserOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    columnStyles?: { [key: number]: any };
    margin?: { top?: number; right?: number; bottom?: number; left?: number };
    styles?: any;
    didDrawPage?: (data: any) => void;
    didDrawCell?: (data: any) => void;
  }

  export default function autoTable(doc: jsPDF, options: UserOptions): void;
}
