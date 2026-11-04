using System.IO;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.SaveSystem
{
    /// <summary>
    /// Central manager for loading, persisting, and caching player progress and game settings.
    /// </summary>
    public class SaveManager : MonoBehaviour
    {
        private static SaveManager _instance;
        public static SaveManager Instance => _instance;

        private const string SAVE_FILE_NAME = "survivor_save.json";
        private string _saveFilePath;

        [SerializeField] private SaveData _currentSave;
        public SaveData CurrentSave => _currentSave;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
            ServiceLocator.Register(this);

            _saveFilePath = Path.Combine(Application.persistentDataPath, SAVE_FILE_NAME);
            Load();
        }

        public void Load()
        {
            _currentSave = SaveSerializer.LoadFromFile(_saveFilePath);
        }

        public void Save()
        {
            SaveSerializer.SaveToFile(_currentSave, _saveFilePath);
        }

        public void UpdateProgress(int coinsEarned, float survivalTime, int kills)
        {
            if (_currentSave == null) _currentSave = new SaveData();

            _currentSave.Progress.TotalCoins += coinsEarned;
            _currentSave.Progress.TotalMatchesPlayed++;
            _currentSave.Progress.TotalKills += kills;

            if (survivalTime > _currentSave.Progress.LongestSurvivalTime)
            {
                _currentSave.Progress.LongestSurvivalTime = survivalTime;
            }

            Save();
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                ServiceLocator.Unregister<SaveManager>();
            }
        }
    }
}

