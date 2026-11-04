using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Master coordinator for player sub-components. Follows composition over inheritance.
    /// </summary>
    [RequireComponent(typeof(PlayerStats))]
    [RequireComponent(typeof(PlayerHealth))]
    [RequireComponent(typeof(PlayerMovement))]
    public class PlayerController : MonoBehaviour
    {
        [Header("Data")]
        [SerializeField] private CharacterDataSO _characterData;

        [Header("Components")]
        [SerializeField] private PlayerStats _stats;
        [SerializeField] private PlayerHealth _health;
        [SerializeField] private PlayerMovement _movement;
        [SerializeField] private PlayerCombat _combat;
        [SerializeField] private PlayerAnimation _animation;

        public CharacterDataSO CharacterData => _characterData;
        public PlayerStats Stats => _stats;
        public PlayerHealth Health => _health;
        public PlayerMovement Movement => _movement;

        private void Awake()
        {
            _stats = GetComponent<PlayerStats>();
            _health = GetComponent<PlayerHealth>();
            _movement = GetComponent<PlayerMovement>();
            _combat = GetComponent<PlayerCombat>();
            _animation = GetComponent<PlayerAnimation>();
        }

        private void Start()
        {
            if (_characterData != null)
            {
                InitializeWithData(_characterData);
            }
        }

        public void InitializeWithData(CharacterDataSO data)
        {
            _characterData = data;
            _stats.Initialize(data);
            _health.Initialize(data.BaseHealth);

            if (_combat != null && data.StartingWeapon != null)
            {
                _combat.EquipStartingWeapon(data.StartingWeapon);
            }
        }
    }
}

