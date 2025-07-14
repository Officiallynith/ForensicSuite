export function AcademicHeader() {
  return (
    <div className="bg-white text-gray-900 p-12 rounded-lg shadow-lg mb-8">
      <div className="text-center space-y-6">
        {/* University Logo Area */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">JSS</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">
            JSS Science and Technology University
          </h2>
          <p className="text-gray-600">Mysuru – 570 006</p>
        </div>

        {/* Title */}
        <div className="border-b border-gray-300 pb-6">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            DAFF: Digital Automation Forensic Framework
          </h1>
          <p className="text-lg text-gray-600">
            An Advanced Digital Forensics Framework with Current World Anomaly Detection Capabilities
          </p>
        </div>

        {/* Academic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">
              Submitted by
            </h3>
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-gray-900">Nithin H K</p>
              <p className="text-gray-700">Student</p>
              <p className="text-gray-700">JSS Mahavidyapeetha</p>
              <p className="text-gray-700">JSS Science and Technology University</p>
              <p className="text-gray-700">Mysuru – 570 006</p>
              <p className="text-blue-700 font-semibold mt-3">
                DEPARTMENT OF COMPUTER SCIENCE
              </p>
            </div>
          </div>
          
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-600 pb-2">
              Guided by
            </h3>
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-gray-900">Shwetha S</p>
              <p className="text-gray-700">Assistant Professor</p>
              <p className="text-gray-700">Department of Computer Science</p>
              <p className="text-gray-700">JSS Science and Technology University</p>
              <p className="text-gray-700">Mysuru – 570 006</p>
            </div>
          </div>
        </div>

        {/* Date and Additional Info */}
        <div className="border-t border-gray-300 pt-6 mt-8">
          <p className="text-gray-600 text-sm">
            Academic Year 2025 | Computer Science Project
          </p>
        </div>
      </div>
    </div>
  );
}