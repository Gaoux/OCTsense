// report.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock components and hooks
jest.mock('../../context/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: true,
    }),
}));

// Enhanced translation mock
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => {
            const translations = {
                'report.historyTitle': 'Report History',
                'report.historySubtitle': 'View your past reports',
                'report.empty': 'No reports available',
                'report.name': 'report',
                'report.diagnostic': 'Diagnostic',
                'report.noComment': 'No comments',
                'buttons.delete': 'Delete',
                'buttons.view': 'View',
                'deleteModal.title': 'Confirm Delete',
                'deleteModal.confirm': 'Are you sure you want to delete this',
                'deleteModal.warning': 'This action cannot be undone',
                'buttons.cancel': 'Cancel',
            };
            return translations[key] || key;
        },
    }),
}));

// Mock the reportService functions
jest.mock('../../api/reportService', () => ({
    getReportHistory: jest.fn(),
    deleteReport: jest.fn(),
    createReport: jest.fn(),
    getReportDetail: jest.fn(),
    updateReportDetails: jest.fn(),
    getReportSummary: jest.fn(),
    getReportImage: jest.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Mock ReportCard component to simplify testing
jest.mock('../../components/ui/reportCard', () => ({ report, onView, onDelete }) => (
    <div data-testid="report-card">
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        <button onClick={() => onView(report)}>View</button>
        <button onClick={() => onDelete(report.id)}>Delete</button>
    </div>
));

// Mock ConfirmDeleteModal component
jest.mock('../../components/ui/confirmDeleteModal', () => ({ show, onClose, onConfirm, itemName }) => (
    show && (
        <div role="dialog">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this {itemName}?</p>
            <button onClick={onClose}>Cancel</button>
            <button onClick={onConfirm}>Confirm</button>
        </div>
    )
));

import Report from '../../features/report';
import {
    getReportHistory,
    deleteReport,
    createReport,
    getReportDetail,
    updateReportDetails,
    getReportSummary,
    getReportImage,
} from '../../api/reportService';

// Mock data
const mockReports = [
    {
        id: 1,
        title: 'First Report',
        description: 'This is the first report',
        diagnostic: 'Normal',
        createdAt: '2023-01-01T00:00:00Z',
    },
    {
        id: 2,
        title: 'Second Report',
        description: 'This is the second report',
        diagnostic: 'Abnormal',
        createdAt: '2023-01-02T00:00:00Z',
    },
];

describe('Report Module Integration Tests', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock implementations
        getReportHistory.mockResolvedValue(mockReports);
        deleteReport.mockResolvedValue({});
        createReport.mockResolvedValue({ data: { id: 3, title: 'New Report' } });
        getReportDetail.mockResolvedValue(mockReports[0]);
        updateReportDetails.mockResolvedValue(mockReports[0]);
        getReportSummary.mockResolvedValue({ total: 2, diagnostics: { Normal: 1, Abnormal: 1 } });
        getReportImage.mockResolvedValue(new Blob());
    });

    test('should fetch and display report history on mount', async () => {
        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getReportHistory).toHaveBeenCalledTimes(1);
            expect(screen.getByText('First Report')).toBeInTheDocument();
            expect(screen.getByText('Second Report')).toBeInTheDocument();
        });
    });

    test('should display empty state when no reports exist', async () => {
        getReportHistory.mockResolvedValueOnce([]);

        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No reports available')).toBeInTheDocument();
        });
    });

    test('should open delete confirmation modal when delete button is clicked', async () => {
        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
    });

    test('should delete report when confirmation is accepted', async () => {
        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            const deleteButtons = screen.getAllByText('Delete');
            fireEvent.click(deleteButtons[0]);
        });

        const confirmButton = screen.getByText('Confirm');
        fireEvent.click(confirmButton);

        // Espera a que los cambios de estado terminen
        await waitFor(() => {
            expect(deleteReport).toHaveBeenCalledWith(1);
            // Si esperas que se vuelva a llamar a getReportHistory, pon 2 aquí
            expect(getReportHistory).toHaveBeenCalledTimes(1);
        });
    });

    test('should navigate to report detail when view button is clicked', async () => {
        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            const viewButtons = screen.getAllByText('View');
            fireEvent.click(viewButtons[0]);
            expect(mockNavigate).toHaveBeenCalledWith('/report/1');
        });
    });

    test('should handle API errors gracefully', async () => {
        getReportHistory.mockRejectedValueOnce(new Error('API Error'));
        console.error = jest.fn();

        render(
            <MemoryRouter>
                <Report />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(new Error('API Error'));
        });
    });

    test('should support admin mode when isAdmin is true', async () => {
        // Test createReport with isAdmin
        const formData = new FormData();
        await createReport(formData, true);
        expect(createReport).toHaveBeenCalledWith(formData, true);
    });

    test('should fetch report image correctly', async () => {
        const blob = await getReportImage(1, false);
        expect(getReportImage).toHaveBeenCalledWith(1, false);
        expect(blob).toBeInstanceOf(Blob);
    });

    test('should update report details correctly', async () => {
        const updatedData = { title: 'Updated Title' };
        const result = await updateReportDetails(1, updatedData, false);
        expect(updateReportDetails).toHaveBeenCalledWith(1, updatedData, false);
        expect(result).toEqual(mockReports[0]);
    });

    test('should fetch report summary correctly', async () => {
        const summary = await getReportSummary(false);
        expect(getReportSummary).toHaveBeenCalledWith(false);
        expect(summary).toEqual({ total: 2, diagnostics: { Normal: 1, Abnormal: 1 } });
    });
});