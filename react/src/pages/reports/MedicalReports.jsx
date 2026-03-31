import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Eye,
  Trash2,
  Search,
  Upload,
  X,
  AlertCircle,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Building2,
  Activity,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  File,
  Image as ImageIcon,
  Clock,
  CheckCircle,
  Shield,
} from "lucide-react";

export default function MedicalReportsPage() {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [camps, setCamps] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [uploadForm, setUploadForm] = useState({
    userId: "",
    donationEventId: "",
    reportFile: null,
    reportPreview: null,
    reportType: "",
    uploadDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Initialize sample data
  useEffect(() => {
    // Load users from localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Create sample users if none exist
      const sampleUsers = [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh.kumar@example.com",
          phone: "9841234567",
          dateOfBirth: "1990-05-15",
          gender: "Male",
          address: "Street 12, Ward 5",
          city: "Kathmandu",
          state: "Bagmati",
          zipCode: "44600",
          country: "Nepal",
          bloodType: "A+",
          type: "Donor",
          role: "general",
          status: "active",
          profileImage: "",
        },
        {
          id: 2,
          name: "Sita Sharma",
          email: "sita.sharma@example.com",
          phone: "9851234568",
          dateOfBirth: "1992-08-20",
          gender: "Female",
          address: "Street 8, Ward 3",
          city: "Pokhara",
          state: "Gandaki",
          zipCode: "33700",
          country: "Nepal",
          bloodType: "B+",
          type: "Donor",
          role: "general",
          status: "active",
          profileImage: "",
        },
        {
          id: 3,
          name: "Prakash Thapa",
          email: "prakash.thapa@example.com",
          phone: "9861234569",
          dateOfBirth: "1988-03-10",
          gender: "Male",
          address: "Street 5, Ward 2",
          city: "Lalitpur",
          state: "Bagmati",
          zipCode: "44700",
          country: "Nepal",
          bloodType: "O+",
          type: "Donor",
          role: "general",
          status: "active",
          profileImage: "",
        },
      ];
      setUsers(sampleUsers);
    }

    // Load camps from localStorage
    const storedCamps = localStorage.getItem("blood_camps");
    if (storedCamps) {
      setCamps(JSON.parse(storedCamps));
    } else {
      // Create sample camps if none exist
      const sampleCamps = [
        {
          id: 1,
          campCode: "BDC-2026-A1B2",
          campName: "Winter Blood Drive 2026",
          organizedBy: "Nepal Red Cross Society",
          startDate: "2026-02-15",
        },
        {
          id: 2,
          campCode: "BDC-2026-C3D4",
          campName: "Community Health Initiative",
          organizedBy: "Kathmandu Medical College",
          startDate: "2026-02-10",
        },
      ];
      setCamps(sampleCamps);
    }

    // Load reports from localStorage
    const storedReports = localStorage.getItem("medical_reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    } else {
      // Create sample reports with placeholder data
      const sampleReports = [
        {
          id: 1,
          uid: "RPT-2026-001",
          userId: 1,
          userName: "Rajesh Kumar",
          userPhone: "9841234567",
          donationEventId: 1,
          donationEventName: "Winter Blood Drive 2026",
          reportFile: "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKE1lZGljYWwgUmVwb3J0KSBUagpFVAplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY0IDAwMDAwIG4gCjAwMDAwMDAxNDYgMDAwMDAgbiAKMDAwMDAwMDI2MyAwMDAwMCBuIAowMDAwMDAwMzUxIDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNDQzCiUlRU9G",
          reportType: "pdf",
          uploadDate: "2026-02-04",
          notes: "Pre-donation screening report",
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: 2,
          uid: "RPT-2026-002",
          userId: 2,
          userName: "Sita Sharma",
          userPhone: "9851234568",
          donationEventId: 2,
          donationEventName: "Community Health Initiative",
          reportFile: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          reportType: "image",
          uploadDate: "2026-02-03",
          notes: "Post-donation medical certificate",
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 3,
          uid: "RPT-2026-003",
          userId: 3,
          userName: "Prakash Thapa",
          userPhone: "9861234569",
          donationEventId: 1,
          donationEventName: "Winter Blood Drive 2026",
          reportFile: "data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KPj4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQlQKL0YxIDI0IFRmCjEwMCA3MDAgVGQKKEhlYWx0aCBDZXJ0aWZpY2F0ZSkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTUgMDAwMDAgbiAKMDAwMDAwMDA2NCAwMDAwMCBuIAowMDAwMDAwMTQ2IDAwMDAwIG4gCjAwMDAwMDAyNjMgMDAwMDAgbiAKMDAwMDAwMDM1MSAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjQ0MwolJUVPRg==",
          reportType: "pdf",
          uploadDate: "2026-02-02",
          notes: "Blood test results",
          createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        },
      ];
      setReports(sampleReports);
      localStorage.setItem("medical_reports", JSON.stringify(sampleReports));
    }
  }, []);

  // Save reports to localStorage whenever they change
  useEffect(() => {
    if (reports.length > 0) {
      localStorage.setItem("medical_reports", JSON.stringify(reports));
    }
  }, [reports]);

  const generateReportUID = () => {
    const year = new Date().getFullYear();
    const count = String(reports.length + 1).padStart(3, "0");
    return `RPT-${year}-${count}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          reportFile: "Please select a valid PDF or image file (JPG, PNG)",
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors({
          ...errors,
          reportFile: "File size should be less than 10MB",
        });
        return;
      }

      // Read and convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const reportType = file.type.startsWith("image/") ? "image" : "pdf";
        setUploadForm({
          ...uploadForm,
          reportFile: reader.result,
          reportPreview: reader.result,
          reportType: reportType,
        });
        setErrors({ ...errors, reportFile: undefined });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateUploadForm = () => {
    const newErrors = {};

    if (!uploadForm.userId) {
      newErrors.userId = "Please select a user";
    }

    if (!uploadForm.donationEventId) {
      newErrors.donationEventId = "Please select a donation event";
    }

    if (!uploadForm.reportFile) {
      newErrors.reportFile = "Please upload a report file";
    }

    if (!uploadForm.uploadDate) {
      newErrors.uploadDate = "Upload date is required";
    }

    return newErrors;
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateUploadForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const selectedUser = users.find((u) => u.id === parseInt(uploadForm.userId));
      const selectedCamp = camps.find((c) => c.id === parseInt(uploadForm.donationEventId));

      const newReport = {
        id: reports.length > 0 ? Math.max(...reports.map((r) => r.id)) + 1 : 1,
        uid: generateReportUID(),
        userId: parseInt(uploadForm.userId),
        userName: selectedUser.name,
        userPhone: selectedUser.phone,
        donationEventId: parseInt(uploadForm.donationEventId),
        donationEventName: selectedCamp.campName,
        reportFile: uploadForm.reportFile,
        reportType: uploadForm.reportType,
        uploadDate: uploadForm.uploadDate,
        notes: uploadForm.notes,
        createdAt: new Date().toISOString(),
      };

      setReports([newReport, ...reports]);

      // Reset form
      setUploadForm({
        userId: "",
        donationEventId: "",
        reportFile: null,
        reportPreview: null,
        reportType: "",
        uploadDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setErrors({});
      setUploadModalOpen(false);
      setLoading(false);
    }, 500);
  };

  const handleViewReport = (reportId) => {
    const report = reports.find((r) => r.id === reportId);
    setSelectedReport(report);
    setViewModalOpen(true);
  };

  const handleViewUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user);
    setUserDetailsModalOpen(true);
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      setReports(reports.filter((r) => r.id !== reportId));
    }
  };

  const handleDownloadReport = (report) => {
    const link = document.createElement("a");
    link.href = report.reportFile;
    link.download = `${report.uid}_${report.userName.replace(/\s/g, "_")}.${
      report.reportType === "pdf" ? "pdf" : "jpg"
    }`;
    link.click();
  };

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.uid.toLowerCase().includes(search.toLowerCase()) ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userPhone.includes(search) ||
      r.donationEventName.toLowerCase().includes(search.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const stats = [
    {
      label: "Total Reports",
      value: reports.length,
      color: "blue",
      icon: FileText,
    },
    {
      label: "PDF Reports",
      value: reports.filter((r) => r.reportType === "pdf").length,
      color: "red",
      icon: File,
    },
    {
      label: "Image Reports",
      value: reports.filter((r) => r.reportType === "image").length,
      color: "green",
      icon: ImageIcon,
    },
    {
      label: "This Month",
      value: reports.filter((r) => {
        const reportDate = new Date(r.uploadDate);
        const now = new Date();
        return (
          reportDate.getMonth() === now.getMonth() &&
          reportDate.getFullYear() === now.getFullYear()
        );
      }).length,
      color: "purple",
      icon: Calendar,
    },
  ];

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Reports</h1>
          <p className="text-gray-600">
            View and manage blood donation medical reports
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${
                    stat.color === "blue"
                      ? "from-blue-500 to-blue-600"
                      : stat.color === "red"
                      ? "from-red-500 to-red-600"
                      : stat.color === "green"
                      ? "from-green-500 to-green-600"
                      : "from-purple-500 to-purple-600"
                  } shadow-lg`}
                >
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Search and Actions */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-800">All Reports</h3>
              <span className="text-sm text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredReports.length)} of{" "}
                {filteredReports.length}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
              <div className="relative flex-1 md:flex-none">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all text-sm"
                />
              </div>

              <button
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 text-sm"
                onClick={() => setUploadModalOpen(true)}
              >
                <Upload size={16} /> Upload Report
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    S.N.
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    UID
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Donation Event
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    User Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Upload Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Report Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentReports.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No reports found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try adjusting your search or upload a new report
                      </p>
                    </td>
                  </tr>
                ) : (
                  currentReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {startIndex + index + 1}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-mono font-medium text-gray-800">
                          {report.uid}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-600">
                          {report.donationEventName}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewUser(report.userId)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {report.userName}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">{report.userPhone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(report.uploadDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                            report.reportType === "pdf"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {report.reportType === "pdf" ? (
                            <File size={12} />
                          ) : (
                            <ImageIcon size={12} />
                          )}
                          {report.reportType === "pdf" ? "PDF" : "Image"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => handleViewReport(report.id)}
                            title="View report"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-green-50 hover:text-green-600 transition-colors"
                            onClick={() => handleDownloadReport(report)}
                            title="Download report"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => handleDeleteReport(report.id)}
                            title="Delete report"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {renderPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg transition-all font-medium text-sm ${
                          currentPage === page
                            ? "bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="text-sm text-gray-600">{filteredReports.length} total reports</div>
            </div>
          )}
        </div>
      </main>

      {/* Upload Report Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl relative my-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
              onClick={() => {
                setUploadModalOpen(false);
                setErrors({});
                setUploadForm({
                  userId: "",
                  donationEventId: "",
                  reportFile: null,
                  reportPreview: null,
                  reportType: "",
                  uploadDate: new Date().toISOString().split("T")[0],
                  notes: "",
                });
              }}
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Medical Report</h2>
              <p className="text-gray-500">
                Upload a blood donation medical report (PDF or Image)
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select User <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadForm.userId}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, userId: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                      errors.userId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Choose a user...</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.phone}
                      </option>
                    ))}
                  </select>
                  {errors.userId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.userId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Event <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadForm.donationEventId}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, donationEventId: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                      errors.donationEventId ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Choose an event...</option>
                    {camps.map((camp) => (
                      <option key={camp.id} value={camp.id}>
                        {camp.campName} ({camp.campCode})
                      </option>
                    ))}
                  </select>
                  {errors.donationEventId && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.donationEventId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={uploadForm.uploadDate}
                    onChange={(e) =>
                      setUploadForm({ ...uploadForm, uploadDate: e.target.value })
                    }
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all ${
                      errors.uploadDate ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.uploadDate && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.uploadDate}
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Report File (PDF or Image) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-red-400 transition-colors">
                  {uploadForm.reportPreview ? (
                    <div className="space-y-4">
                      {uploadForm.reportType === "image" ? (
                        <img
                          src={uploadForm.reportPreview}
                          alt="Report Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center gap-3 p-6 bg-red-50 rounded-xl">
                          <File size={48} className="text-red-600" />
                          <div className="text-left">
                            <p className="font-medium text-gray-800">PDF Report Uploaded</p>
                            <p className="text-sm text-gray-500">Ready to submit</p>
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() =>
                          setUploadForm({
                            ...uploadForm,
                            reportFile: null,
                            reportPreview: null,
                            reportType: "",
                          })
                        }
                        className="text-sm text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-600 mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, or PNG (MAX. 10MB)
                      </p>
                      <label
                        htmlFor="report-file"
                        className="mt-4 inline-block px-6 py-2 bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white rounded-xl font-medium hover:shadow-lg transition-all cursor-pointer"
                      >
                        Select File
                      </label>
                      <input
                        id="report-file"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.reportFile && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.reportFile}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  value={uploadForm.notes}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, notes: e.target.value })
                  }
                  placeholder="Any additional information..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalOpen(false);
                    setErrors({});
                  }}
                  className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Report
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {viewModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-2xl relative my-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
              onClick={() => {
                setViewModalOpen(false);
                setSelectedReport(null);
              }}
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Medical Report</h3>
              <p className="text-sm text-gray-500 font-mono">{selectedReport.uid}</p>
            </div>

            {/* Report Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <User size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Patient</p>
                  <p className="text-sm text-gray-800 font-medium">
                    {selectedReport.userName}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Building2 size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Event</p>
                  <p className="text-sm text-gray-800">{selectedReport.donationEventName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Upload Date</p>
                  <p className="text-sm text-gray-800">
                    {new Date(selectedReport.uploadDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Report Viewer */}
            <div className="bg-gray-100 rounded-xl p-6 mb-6 max-h-96 overflow-auto">
              {selectedReport.reportType === "image" ? (
                <img
                  src={selectedReport.reportFile}
                  alt="Medical Report"
                  className="max-w-full h-auto mx-auto rounded-lg"
                />
              ) : (
                <iframe
                  src={selectedReport.reportFile}
                  className="w-full h-96 rounded-lg"
                  title="Medical Report PDF"
                />
              )}
            </div>

            {selectedReport.notes && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-xs text-blue-600 font-medium mb-1">Notes</p>
                <p className="text-sm text-gray-800">{selectedReport.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => handleDownloadReport(selectedReport)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2"
              >
                <Download size={18} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {userDetailsModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative my-8">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
              onClick={() => {
                setUserDetailsModalOpen(false);
                setSelectedUser(null);
              }}
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-6 text-gray-800">User Details</h3>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              {selectedUser.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl ${
                    selectedUser.type === "Donor"
                      ? "bg-gradient-to-br from-red-500 to-rose-600"
                      : "bg-gradient-to-br from-blue-500 to-blue-600"
                  }`}
                >
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="font-bold text-gray-800 text-xl">{selectedUser.name}</h4>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                      selectedUser.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    <CheckCircle size={12} />
                    {selectedUser.status === "active" ? "Active" : "Pending"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                      selectedUser.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {selectedUser.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                    {selectedUser.role === "admin" ? "Admin" : "General"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold">
                    <Droplet size={12} />
                    {selectedUser.bloodType}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Mail size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
                  <p className="text-sm text-gray-800 break-all">{selectedUser.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Phone size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
                  <p className="text-sm text-gray-800">{selectedUser.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Calendar size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Date of Birth</p>
                  <p className="text-sm text-gray-800">
                    {new Date(selectedUser.dateOfBirth).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <User size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Gender</p>
                  <p className="text-sm text-gray-800">{selectedUser.gender}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl md:col-span-2">
                <MapPin size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Address</p>
                  <p className="text-sm text-gray-800">
                    {selectedUser.address}, {selectedUser.city}, {selectedUser.state}{" "}
                    {selectedUser.zipCode}, {selectedUser.country}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Users size={20} className="text-gray-500 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">User Type</p>
                  <p
                    className={`text-sm font-semibold ${
                      selectedUser.type === "Donor" ? "text-red-600" : "text-blue-600"
                    }`}
                  >
                    {selectedUser.type}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}