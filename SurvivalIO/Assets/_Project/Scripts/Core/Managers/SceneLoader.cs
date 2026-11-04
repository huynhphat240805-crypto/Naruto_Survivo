using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Handles asynchronous scene transitions and loading states.
    /// </summary>
    public class SceneLoader : MonoBehaviour
    {
        private static SceneLoader _instance;
        public static SceneLoader Instance => _instance;

        private bool _isLoading;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void LoadScene(string sceneName)
        {
            if (_isLoading) return;
            StartCoroutine(LoadSceneRoutine(sceneName));
        }

        private IEnumerator LoadSceneRoutine(string sceneName)
        {
            _isLoading = true;
            AsyncOperation op = SceneManager.LoadSceneAsync(sceneName);
            while (!op.isDone)
            {
                yield return null;
            }
            _isLoading = false;
        }

        public void LoadBootstrap() => LoadScene(GameConstants.SCENE_BOOTSTRAP);
        public void LoadMainMenu() => LoadScene(GameConstants.SCENE_MAIN_MENU);
        public void LoadCharacterSelect() => LoadScene(GameConstants.SCENE_CHARACTER_SELECT);
        public void LoadGameplay() => LoadScene(GameConstants.SCENE_GAMEPLAY);
        public void LoadResult() => LoadScene(GameConstants.SCENE_RESULT);
        public void LoadSettings() => LoadScene(GameConstants.SCENE_SETTINGS);
    }
}

