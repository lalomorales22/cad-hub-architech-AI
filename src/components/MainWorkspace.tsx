
      {/* Advanced AI Widget */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <AdvancedAIWidget
            onGenerate={handleAIGenerate}
            onClose={() => setShowAIGenerator(false)}
            theme={theme}
          />
        </div>
      )}

      {/* Chat Panel */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[32rem] shadow-2xl z-40">
          <Chat onClose={() => setShowChat(false)} />
        </div>
      )}

      {/* Model Importer */}
      {showImporter && (
        <ModelImporter
          onImport={handleImportModel}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
};
