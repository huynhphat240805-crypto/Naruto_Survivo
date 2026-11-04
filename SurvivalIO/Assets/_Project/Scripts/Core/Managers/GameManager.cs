using UnityEngine;

namespace SurvivalIO.Core
{
    /// <summary>
    /// Coordinates the high-level match lifecycle (start, pause, game over, victory).
    /// Follows SRP by delegating specific domain logic to dedicated managers.
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        private static GameManager _instance;
        public static GameManager Instance => _instance;

        [Header("Match Stats")]
        [SerializeField] private float _survivalTime;
        [SerializeField] private int _killCount;
        [SerializeField] private bool _isMatchActive;

        public float SurvivalTime => _survivalTime;
        public int KillCount => _killCount;
        public bool IsMatchActive => _isMatchActive;

        private void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            ServiceLocator.Register(this);
        }

        private void OnEnable()
        {
            GameEventBus.Subscribe<PlayerDiedEvent>(OnPlayerDied);
            GameEventBus.Subscribe<EnemyKilledEvent>(OnEnemyKilled);
        }

        private void OnDisable()
        {
            GameEventBus.Unsubscribe<PlayerDiedEvent>(OnPlayerDied);
            GameEventBus.Unsubscribe<EnemyKilledEvent>(OnEnemyKilled);
        }

        private void Start()
        {
            StartMatch();
        }

        private void Update()
        {
            if (!_isMatchActive) return;

            if (GameStateManager.Instance != null && 
                GameStateManager.Instance.CurrentStateType == GameStateType.Playing)
            {
                _survivalTime += Time.deltaTime;
            }
        }

        public void StartMatch()
        {
            _survivalTime = 0f;
            _killCount = 0;
            _isMatchActive = true;

            if (GameStateManager.Instance != null)
            {
                GameStateManager.Instance.ChangeState(GameStateType.Playing);
            }
        }

        public void PauseMatch()
        {
            if (!_isMatchActive) return;
            GameStateManager.Instance?.ChangeState(GameStateType.Paused);
        }

        public void ResumeMatch()
        {
            if (!_isMatchActive) return;
            GameStateManager.Instance?.ChangeState(GameStateType.Playing);
        }

        public void TriggerLevelUp()
        {
            if (!_isMatchActive) return;
            GameStateManager.Instance?.ChangeState(GameStateType.LevelUp);
        }

        public void EndMatch()
        {
            _isMatchActive = false;
            GameStateManager.Instance?.ChangeState(GameStateType.GameOver);
        }

        private void OnPlayerDied(PlayerDiedEvent e)
        {
            EndMatch();
        }

        private void OnEnemyKilled(EnemyKilledEvent e)
        {
            _killCount++;
        }

        private void OnDestroy()
        {
            if (_instance == this)
            {
                ServiceLocator.Unregister<GameManager>();
            }
        }
    }
}

