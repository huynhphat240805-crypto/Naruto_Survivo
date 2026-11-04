using System;
using System.IO;
using UnityEngine;

namespace SurvivalIO.SaveSystem
{
    /// <summary>
    /// Handles disk serialization and deserialization of SaveData.
    /// </summary>
    public static class SaveSerializer
    {
        public static bool SaveToFile(SaveData data, string filePath)
        {
            try
            {
                data.Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                string json = JsonUtility.ToJson(data, true);
                string directory = Path.GetDirectoryName(filePath);
                if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                File.WriteAllText(filePath, json);
                return true;
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveSerializer] Error saving file to {filePath}: {ex.Message}");
                return false;
            }
        }

        public static SaveData LoadFromFile(string filePath)
        {
            try
            {
                if (!File.Exists(filePath))
                {
                    return new SaveData();
                }

                string json = File.ReadAllText(filePath);
                SaveData data = JsonUtility.FromJson<SaveData>(json);
                return data ?? new SaveData();
            }
            catch (Exception ex)
            {
                Debug.LogError($"[SaveSerializer] Error loading file from {filePath}: {ex.Message}");
                return new SaveData();
            }
        }
    }
}

