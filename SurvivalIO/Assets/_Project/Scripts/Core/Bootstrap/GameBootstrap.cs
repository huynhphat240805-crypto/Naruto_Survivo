using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Entry point for global system bootstrap on application startup.
    /// Ensures core managers exist, configures application environment, and boots to Main Menu.
    /// </summary>
    public class GameBootstrap : MonoBehaviour
    {
        [Header("Bootstrap Configuration")]
        [SerializeField] private bool _autoLoadMainMenu = true;
        [SerializeField] private int _targetFrameRate = GameConstants.DEFAULT_TARGET_FRAME_RATE;

        private void Awake()
        {
            InitializeApplication();
            EnsureCoreManagers();
        }

        private void Start()
        {
            if (_autoLoadMainMenu && SceneLoader.Instance != null)
            {
                SceneLoader.Instance.LoadMainMenu();
            }
        }

        private void InitializeApplication()
        {
            Application.targetFrameRate = _targetFrameRate;
            Screen.sleepTimeout = SleepTimeout.NeverSleep;
        }

        private void EnsureCoreManagers()
        {
            if (GameStateManager.Instance == null)
            {
                GameObject gsm = new GameObject("[GameStateManager]");
                gsm.AddComponent<GameStateManager>();
            }

            if (SceneLoader.Instance == null)
            {
                GameObject sl = new GameObject("[SceneLoader]");
                sl.AddComponent<SceneLoader>();
            }
        }
    }
}

