using System;
using UnityEngine;
using SurvivalIO.Items;

namespace SurvivalIO.Player
{
    /// <summary>
    /// Connects ItemCollector XP pickups to progression systems.
    /// </summary>
    public class PlayerExperience : MonoBehaviour
    {
        [SerializeField] private ItemCollector _collector;
        public event Action<float> OnExpGained;

        private void Awake()
        {
            if (_collector == null) _collector = GetComponent<ItemCollector>();
        }

        private void OnEnable()
        {
            if (_collector != null)
            {
                _collector.OnExperienceCollected += HandleExpCollected;
            }
        }

        private void OnDisable()
        {
            if (_collector != null)
            {
                _collector.OnExperienceCollected -= HandleExpCollected;
            }
        }

        private void HandleExpCollected(float amount)
        {
            OnExpGained?.Invoke(amount);
        }
    }
}

