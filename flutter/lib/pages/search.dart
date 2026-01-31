  import 'package:flutter/material.dart';
  import 'package:get/get.dart';
  import 'package:google_maps_flutter/google_maps_flutter.dart';
  import 'dart:async';
  import '../mywidgets/buttomnav.dart';
  import '../routes/app_routes.dart';

  class SearchDonorsPage extends StatefulWidget {
    const SearchDonorsPage({super.key});

    @override
    State<SearchDonorsPage> createState() => _SearchDonorsPageState();
  }

  class _SearchDonorsPageState extends State<SearchDonorsPage> {
    int _currentIndex = 2;
    GoogleMapController? _mapController;
    String _selectedBloodType = 'All';
    double _searchRadius = 5.0; // in km
    bool _showMap = true;

    void _onBottomNavTap(int index) {
      setState(() => _currentIndex = index);
      switch (index) {
        case 0:
          Get.offNamed('/home');
          break;
        case 1:
          Get.toNamed('/reports');
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


    // Kathmandu center coordinates
    final LatLng _initialPosition = const LatLng(27.7172, 85.3240);

    // Sample nearby donors data
    final List<Map<String, dynamic>> _nearbyDonors = [
      {
        'name': 'Ram Sharma',
        'bloodType': 'O+',
        'distance': '1.2 km',
        'lastDonation': '3 months ago',
        'donations': 8,
        'available': true,
        'phone': '+977 9841234567',
        'location': const LatLng(27.7172, 85.3240),
      },
      {
        'name': 'Sita Thapa',
        'bloodType': 'A+',
        'distance': '2.5 km',
        'lastDonation': '2 months ago',
        'donations': 12,
        'available': true,
        'phone': '+977 9841234568',
        'location': const LatLng(27.7100, 85.3300),
      },
      {
        'name': 'Krishna Adhikari',
        'bloodType': 'B+',
        'distance': '3.8 km',
        'lastDonation': '1 month ago',
        'donations': 5,
        'available': false,
        'phone': '+977 9841234569',
        'location': const LatLng(27.7200, 85.3150),
      },
      {
        'name': 'Gita Poudel',
        'bloodType': 'AB+',
        'distance': '4.2 km',
        'lastDonation': '4 months ago',
        'donations': 15,
        'available': true,
        'phone': '+977 9841234570',
        'location': const LatLng(27.7050, 85.3280),
      },
      {
        'name': 'Hari Basnet',
        'bloodType': 'O+',
        'distance': '4.8 km',
        'lastDonation': '2 months ago',
        'donations': 10,
        'available': true,
        'phone': '+977 9841234571',
        'location': const LatLng(27.7250, 85.3350),
      },
    ];

    List<Map<String, dynamic>> get _filteredDonors {
      if (_selectedBloodType == 'All') {
        return _nearbyDonors;
      }
      return _nearbyDonors
          .where((donor) => donor['bloodType'] == _selectedBloodType)
          .toList();
    }

    @override
    Widget build(BuildContext context) {
      return Scaffold(
        backgroundColor: Colors.grey.shade50,
        appBar: _buildAppBar(),
        body: Column(
          children: [
            // Filter Section
            _buildFilterSection(),

            // Toggle Map/List View
            _buildViewToggle(),

            // Map or List View
            Expanded(
              child: _showMap ? _buildMapView() : _buildListView(),
            ),
          ],
        ),
        bottomNavigationBar: AppBottomNavigation(
          currentIndex: _currentIndex,
          onTap: _onBottomNavTap,
        ),
      );
    }

    PreferredSizeWidget _buildAppBar() {
      return AppBar(
        automaticallyImplyLeading: false,
        elevation: 0,
        backgroundColor: Colors.red,
        title: const Text(
          "Find Donors Nearby",
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: Colors.white),
            onPressed: _showFilterDialog,
          ),
          const SizedBox(width: 8),
        ],
      );
    }

    Widget _buildFilterSection() {
      return Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              "Blood Type",
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 12),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _bloodTypeChip('All'),
                  _bloodTypeChip('O+'),
                  _bloodTypeChip('O-'),
                  _bloodTypeChip('A+'),
                  _bloodTypeChip('A-'),
                  _bloodTypeChip('B+'),
                  _bloodTypeChip('B-'),
                  _bloodTypeChip('AB+'),
                  _bloodTypeChip('AB-'),
                ],
              ),
            ),
          ],
        ),
      );
    }

    Widget _bloodTypeChip(String type) {
      final isSelected = _selectedBloodType == type;
      return GestureDetector(
        onTap: () {
          setState(() {
            _selectedBloodType = type;
          });
        },
        child: Container(
          margin: const EdgeInsets.only(right: 8),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Colors.red : Colors.grey.shade200,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? Colors.red : Colors.grey.shade300,
              width: 1,
            ),
          ),
          child: Text(
            type,
            style: TextStyle(
              color: isSelected ? Colors.white : Colors.black87,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 13,
            ),
          ),
        ),
      );
    }

    Widget _buildViewToggle() {
      return Container(
        margin: const EdgeInsets.all(16),
        padding: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: Colors.grey.shade200,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _showMap = true),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: _showMap ? Colors.white : Colors.transparent,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: _showMap
                        ? [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                      )
                    ]
                        : null,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.map,
                        color: _showMap ? Colors.red : Colors.grey.shade600,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "Map View",
                        style: TextStyle(
                          color: _showMap ? Colors.red : Colors.grey.shade600,
                          fontWeight:
                          _showMap ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _showMap = false),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    color: !_showMap ? Colors.white : Colors.transparent,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: !_showMap
                        ? [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                      )
                    ]
                        : null,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.list,
                        color: !_showMap ? Colors.red : Colors.grey.shade600,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        "List View",
                        style: TextStyle(
                          color: !_showMap ? Colors.red : Colors.grey.shade600,
                          fontWeight:
                          !_showMap ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    Widget _buildMapView() {
      return Stack(
        children: [
          GoogleMap(
            initialCameraPosition: CameraPosition(
              target: _initialPosition,
              zoom: 13.0,
            ),
            onMapCreated: (controller) {
              _mapController = controller;
            },
            markers: _filteredDonors.map((donor) {
              return Marker(
                markerId: MarkerId(donor['name']),
                position: donor['location'],
                icon: BitmapDescriptor.defaultMarkerWithHue(
                  donor['available']
                      ? BitmapDescriptor.hueRed
                      : BitmapDescriptor.hueOrange,
                ),
                infoWindow: InfoWindow(
                  title: donor['name'],
                  snippet: '${donor['bloodType']} - ${donor['distance']}',
                ),
              );
            }).toSet(),
            myLocationEnabled: true,
            myLocationButtonEnabled: true,
            zoomControlsEnabled: false,
          ),
          // Radius Info
          Positioned(
            top: 16,
            left: 16,
            right: 16,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.1),
                    blurRadius: 10,
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on, color: Colors.red, size: 20),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      '${_filteredDonors.length} donors within ${_searchRadius.toStringAsFixed(1)} km',
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      );
    }

    Widget _buildListView() {
      return ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _filteredDonors.length,
        itemBuilder: (context, index) {
          final donor = _filteredDonors[index];
          return _donorCard(donor);
        },
      );
    }

    Widget _donorCard(Map<String, dynamic> donor) {
      return Container(
        margin: const EdgeInsets.only(bottom: 12),
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
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Blood Type Badge
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      donor['bloodType'],
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                    if (donor['available'])
                      Container(
                        margin: const EdgeInsets.only(top: 4),
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: Colors.green,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
              ),

              const SizedBox(width: 16),

              // Donor Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            donor['name'],
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: donor['available']
                                ? Colors.green.withOpacity(0.1)
                                : Colors.orange.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            donor['available'] ? 'Available' : 'Not Available',
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color:
                              donor['available'] ? Colors.green : Colors.orange,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.location_on,
                            size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 4),
                        Text(
                          donor['distance'],
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Icon(Icons.favorite,
                            size: 14, color: Colors.grey.shade600),
                        const SizedBox(width: 4),
                        Text(
                          '${donor['donations']} donations',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Last donation: ${donor['lastDonation']}',
                      style: TextStyle(
                        fontSize: 11,
                        color: Colors.grey.shade500,
                      ),
                    ),
                  ],
                ),
              ),

              // Actions
              Column(
                children: [
                  IconButton(
                    icon: const Icon(Icons.phone, color: Colors.green),
                    onPressed: () {
                      _showContactDialog(donor);
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.message, color: Colors.blue),
                    onPressed: () {
                      Get.toNamed('/chats');
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      );
    }

    void _showFilterDialog() {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Search Radius'),
          content: StatefulBuilder(
            builder: (context, setDialogState) {
              return Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${_searchRadius.toStringAsFixed(1)} km',
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.red,
                    ),
                  ),
                  Slider(
                    value: _searchRadius,
                    min: 1.0,
                    max: 20.0,
                    divisions: 19,
                    activeColor: Colors.red,
                    label: '${_searchRadius.toStringAsFixed(1)} km',
                    onChanged: (value) {
                      setDialogState(() {
                        _searchRadius = value;
                      });
                    },
                  ),
                ],
              );
            },
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
              ),
              onPressed: () {
                setState(() {});
                Navigator.pop(context);
              },
              child: const Text('Apply'),
            ),
          ],
        ),
      );
    }

    void _showContactDialog(Map<String, dynamic> donor) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Contact ${donor['name']}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Phone: ${donor['phone']}'),
              const SizedBox(height: 8),
              Text('Blood Type: ${donor['bloodType']}'),
              const SizedBox(height: 8),
              Text('Distance: ${donor['distance']}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
              ),
              onPressed: () {
                // Handle phone call
                Navigator.pop(context);
              },
              child: const Text('Call Now'),
            ),
          ],
        ),
      );
    }
  }