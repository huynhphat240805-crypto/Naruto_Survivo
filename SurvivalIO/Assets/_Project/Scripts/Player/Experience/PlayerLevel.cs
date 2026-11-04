using UnityEngine;
using SurvivalIO.Progression;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Player-level component bridging PlayerExperience and Progression LevelManager.
    /// </summary>
    public class PlayerLevel : MonoBehaviour
    {
        [SerializeField] private PlayerExperience _playerExp;
        [SerializeField] private LevelManager _levelManager;

        private void Awake()
        {
            if (_playerExp == null) _playerExp = GetComponent<PlayerExperience>();
            if (_levelManager == null) _levelManager = GetComponent<LevelManager>();
        }

        private void OnEnable()
        {
            if (_playerExp != null && _levelManager != null)
            {
                _playerExp.OnExpGained += _levelManager.AddExperience;
            }
        }

        private void OnDisable()
        {
            if (_playerExp != null && _levelManager != null)
            {
                _playerExp.OnExpGained -= _levelManager.AddExperience;
            }
        }
    }
}

