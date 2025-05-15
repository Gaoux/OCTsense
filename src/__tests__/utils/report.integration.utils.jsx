import { 
  createReport,
  getReportHistory,
  getReportDetail,
  deleteReport,
  updateReportComments,
  getReportSummary,
  getReportImage
} from '../../api/reportService';

export const mockReportService = {
  success: () => {
    const mockReports = [{
      id: '1',
      predicted_diagnostic: 'CNV',
      created_at: '2023-01-01',
      image_url: '/images/report1.jpg',
      diagnostic_probabilities: {
        CNV: 0.85,
        DME: 0.1,
        DRUSEN: 0.03,
        NORMAL: 0.02
      }
    }];

    createReport.mockResolvedValue({ data: { id: 'new-report' } });
    getReportHistory.mockResolvedValue(mockReports);
    getReportDetail.mockResolvedValue(mockReports[0]);
    deleteReport.mockResolvedValue({});
    updateReportComments.mockResolvedValue(mockReports[0]);
    getReportSummary.mockResolvedValue({ total_reports: 1 });
    getReportImage.mockResolvedValue(new Blob());

    return {
      createReport,
      getReportHistory,
      getReportDetail,
      deleteReport,
      updateReportComments,
      getReportSummary,
      getReportImage
    };
  },
  error: () => {
    const error = new Error('API Error');
    
    createReport.mockRejectedValue(error);
    getReportHistory.mockRejectedValue(error);
    getReportDetail.mockRejectedValue(error);
    deleteReport.mockRejectedValue(error);
    updateReportComments.mockRejectedValue(error);
    getReportSummary.mockRejectedValue(error);
    getReportImage.mockRejectedValue(error);

    return {
      createReport,
      getReportHistory,
      getReportDetail,
      deleteReport,
      updateReportComments,
      getReportSummary,
      getReportImage
    };
  }
};

export const restoreReportMocks = () => {
  jest.clearAllMocks();
};