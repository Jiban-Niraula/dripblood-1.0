import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:dripblood/mywidgets/buttomnav.dart';

class ReportsPage extends StatefulWidget {
  const ReportsPage({super.key});

  @override
  State<ReportsPage> createState() => _ReportsPageState();
}

class _ReportsPageState extends State<ReportsPage> {
  int _currentIndex = 1; // Reports tab index

  final List<Map<String, dynamic>> donationReports = [
    {
      'id': 'REP-2024-001',
      'date': '15 Nov 2024',
      'hospital': 'City General Hospital',
      'checkedBy': 'Dr. Sarah Johnson',
      'bloodType': 'O+',
      'units': '450 ml',
      'status': 'Completed',
      'hasPdf': true,
    },
    {
      'id': 'REP-2024-002',
      'date': '03 Oct 2024',
      'hospital': 'Red Cross Blood Bank',
      'checkedBy': 'Dr. Michael Chen',
      'bloodType': 'O+',
      'units': '450 ml',
      'status': 'Completed',
      'hasPdf': true,
    },
    {
      'id': 'REP-2024-003',
      'date': '20 Aug 2024',
      'hospital': 'Memorial Medical Center',
      'checkedBy': 'Dr. Priya Sharma',
      'bloodType': 'O+',
      'units': '450 ml',
      'status': 'Completed',
      'hasPdf': true,
    },
    {
      'id': 'REP-2024-004',
      'date': '05 Jul 2024',
      'hospital': 'Community Health Clinic',
      'checkedBy': 'Dr. James Wilson',
      'bloodType': 'O+',
      'units': '450 ml',
      'status': 'Completed',
      'hasPdf': false,
    },
    {
      'id': 'REP-2024-005',
      'date': '12 May 2024',
      'hospital': 'Central Hospital',
      'checkedBy': 'Dr. Emily Brown',
      'bloodType': 'O+',
      'units': '450 ml',
      'status': 'Completed',
      'hasPdf': true,
    },
  ];

  @override
  void initState() {
    super.initState();
    _sortReportsDescending();
  }

  // Sort reports by date descending
  void _sortReportsDescending() {
    donationReports.sort((a, b) {
      DateTime dateA = DateTime.parse(_formatDate(a['date']));
      DateTime dateB = DateTime.parse(_formatDate(b['date']));
      return dateB.compareTo(dateA); // Descending
    });
  }

  // Convert '15 Nov 2024' -> '2024-11-15'
  String _formatDate(String dateStr) {
    List<String> parts = dateStr.split(' ');
    int day = int.parse(parts[0]);
    int year = int.parse(parts[2]);
    int month = _monthStringToInt(parts[1]);
    return '$year-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
  }

  int _monthStringToInt(String month) {
    switch (month) {
      case 'Jan': return 1;
      case 'Feb': return 2;
      case 'Mar': return 3;
      case 'Apr': return 4;
      case 'May': return 5;
      case 'Jun': return 6;
      case 'Jul': return 7;
      case 'Aug': return 8;
      case 'Sep': return 9;
      case 'Oct': return 10;
      case 'Nov': return 11;
      case 'Dec': return 12;
      default: return 1;
    }
  }

  void _onBottomNavTap(int index) {
    setState(() => _currentIndex = index);
    switch (index) {
      case 0:
        Get.offNamed('/home');
        break;
      case 1:
        Get.offNamed('/reports');
        break;
      case 2:
        Get.toNamed('/search');
        break;
      case 3:
        Get.toNamed('/chats');
        break;
      case 4:
        Get.toNamed('/settings');
        break;
    }
  }

  void _viewPdfReport(Map<String, dynamic> report) {
    Get.snackbar(
      'Opening Report',
      'Loading PDF for ${report['id']}',
      backgroundColor: Colors.red.shade100,
      colorText: Colors.red.shade900,
      icon: const Icon(Icons.picture_as_pdf, color: Colors.red),
      snackPosition: SnackPosition.BOTTOM,
      margin: const EdgeInsets.all(16),
      borderRadius: 12,
      duration: const Duration(seconds: 2),
    );
  }

  void _downloadReport(Map<String, dynamic> report) {
    Get.snackbar(
      'Download Started',
      'Downloading ${report['id']}.pdf',
      backgroundColor: Colors.green.shade100,
      colorText: Colors.green.shade900,
      icon: const Icon(Icons.download, color: Colors.green),
      snackPosition: SnackPosition.BOTTOM,
      margin: const EdgeInsets.all(16),
      borderRadius: 12,
      duration: const Duration(seconds: 2),
    );
  }

  void _shareReport(Map<String, dynamic> report) {
    Get.snackbar(
      'Share Report',
      'Sharing ${report['id']}',
      backgroundColor: Colors.blue.shade100,
      colorText: Colors.blue.shade900,
      icon: const Icon(Icons.share, color: Colors.blue),
      snackPosition: SnackPosition.BOTTOM,
      margin: const EdgeInsets.all(16),
      borderRadius: 12,
      duration: const Duration(seconds: 2),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        automaticallyImplyLeading: false, // no default back button
        backgroundColor: Colors.red,
        elevation: 0,
        title: const Text(
          'Donation Reports',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: Colors.white),
            onPressed: () {
              // TODO: Implement filter functionality
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Summary Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: const BoxDecoration(
              color: Colors.red,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
            ),
            child: Column(
              children: [
                const Text(
                  'Total Donations',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${donationReports.length}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                const Text(
                  'You have made a difference!',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Reports List
          Expanded(
            child: donationReports.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: donationReports.length,
              itemBuilder: (context, index) {
                final report = donationReports[index];
                return _buildReportCard(report);
              },
            ),
          ),
        ],
      ),
      bottomNavigationBar: AppBottomNavigation(
        currentIndex: _currentIndex,
        onTap: _onBottomNavTap,
      ),
    );
  }

  Widget _buildReportCard(Map<String, dynamic> report) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Main Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.red.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Image.asset(
                    'assets/logo.png',
                    height: 40,
                    width: 40,
                    errorBuilder: (context, error, stackTrace) {
                      return const Icon(
                        Icons.bloodtype,
                        size: 40,
                        color: Colors.red,
                      );
                    },
                  ),
                ),
                const SizedBox(width: 16),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Report ID and Status
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            report['id'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.green.shade50,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              report['status'],
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Colors.green.shade700,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Date
                      Row(
                        children: [
                          Icon(Icons.calendar_today, size: 14, color: Colors.grey.shade600),
                          const SizedBox(width: 6),
                          Text(
                            'Date: ${report['date']}',
                            style: TextStyle(
                              fontSize: 13,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Hospital
                      Row(
                        children: [
                          Icon(Icons.local_hospital, size: 14, color: Colors.grey.shade600),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              report['hospital'],
                              style: TextStyle(fontSize: 13, color: Colors.grey.shade700),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),

                      // Checked By
                      Row(
                        children: [
                          Icon(Icons.person, size: 14, color: Colors.grey.shade600),
                          const SizedBox(width: 6),
                          Text(
                            'Checked by: ${report['checkedBy']}',
                            style: TextStyle(fontSize: 13, color: Colors.grey.shade700),
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),

                      // Blood Type and Units
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.red.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.bloodtype, size: 12, color: Colors.red),
                                const SizedBox(width: 4),
                                Text(
                                  report['bloodType'],
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.red,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.blue.shade50,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              report['units'],
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Colors.blue.shade700,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // PDF Actions (if available)
          if (report['hasPdf']) ...[
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildActionButton(
                    icon: Icons.picture_as_pdf,
                    label: 'View PDF',
                    color: Colors.red,
                    onTap: () => _viewPdfReport(report),
                  ),
                  Container(width: 1, height: 30, color: Colors.grey.shade300),
                  _buildActionButton(
                    icon: Icons.download,
                    label: 'Download',
                    color: Colors.green,
                    onTap: () => _downloadReport(report),
                  ),
                  Container(width: 1, height: 30, color: Colors.grey.shade300),
                  _buildActionButton(
                    icon: Icons.share,
                    label: 'Share',
                    color: Colors.blue,
                    onTap: () => _shareReport(report),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Row(
          children: [
            Icon(icon, size: 18, color: color),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: color),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.description_outlined, size: 80, color: Colors.grey.shade400),
          const SizedBox(height: 16),
          Text(
            'No Reports Yet',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.grey.shade600),
          ),
          const SizedBox(height: 8),
          Text(
            'Your donation reports will appear here',
            style: TextStyle(fontSize: 14, color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }
}
