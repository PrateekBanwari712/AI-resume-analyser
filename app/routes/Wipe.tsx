import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/peuter";

const WipeApp = () => {
  const { auth, isLoading, error, clearError, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading]);

  const handleDelete = async () => {
    files.forEach(async (file) => {
      await fs.delete(file.path);
    });
    await kv.flush();
    loadFiles();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error {error}</div>;
  }

  return (
    <div className="min-h-screen w-full bg-[url('/images/bg-main.svg')] bg-cover bg-fixed">
      <div className="min-h-screen bg-black/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Wipe App Data
            </h1>
            <p className="text-sm sm:text-base text-gray-200">
              Authenticated as:{" "}
              <span className="font-semibold">{auth.user?.username}</span>
            </p>
          </div>

          {/* Files Section */}
          <div className="mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">
              Existing Files ({files.length})
            </h2>

            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <p>No files found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center bg-white/10 backdrop-blur border border-white/20 rounded-lg p-4 hover:bg-white/20 hover:border-white/40 transition-all duration-200"
                  >
                    <p className="text-white font-medium truncate text-sm sm:text-base">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg cursor-pointer transition-colors duration-200 active:scale-95 transform"
              onClick={() => handleDelete()}
            >
              Wipe App Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WipeApp;
