using UnityEngine;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Connects LevelManager events directly to UpgradeManager flow.
    /// </summary>
    public class LevelUpController : MonoBehaviour
    {
        [SerializeField] private LevelManager _levelManager;
        [SerializeField] private UpgradeManager _upgradeManager;

        private void Awake()
        {
            if (_levelManager == null) _levelManager = GetComponent<LevelManager>();
            if (_upgradeManager == null) _upgradeManager = GetComponent<UpgradeManager>();
        }

        private void OnEnable()
        {
            if (_levelManager != null)
            {
                _levelManager.OnLevelUp += HandleLevelUp;
            }
        }

        private void OnDisable()
        {
            if (_levelManager != null)
            {
                _levelManager.OnLevelUp -= HandleLevelUp;
            }
        }

        private void HandleLevelUp(int newLevel)
        {
            _upgradeManager?.TriggerLevelUpChoice();
        }
    }
}

