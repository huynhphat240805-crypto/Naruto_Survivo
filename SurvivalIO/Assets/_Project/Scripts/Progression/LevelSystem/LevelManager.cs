using System;
using UnityEngine;
using SurvivalIO.Core;

namespace SurvivalIO.Progression
{
    /// <summary>
    /// Tracks current player level, accumulated XP, and notifies systems upon level progression.
    /// </summary>
    public class LevelManager : MonoBehaviour
    {
        [SerializeField] private ExperienceManager _expCalculator;
        [SerializeField] private int _currentLevel = 1;
        [SerializeField] private float _currentExp = 0f;
        [SerializeField] private float _requiredExp = 10f;

        public int CurrentLevel => _currentLevel;
        public float CurrentExp => _currentExp;
        public float RequiredExp => _requiredExp;
        public float ProgressNormalized => Mathf.Clamp01(_currentExp / Mathf.Max(1f, _requiredExp));

        public event Action<int> OnLevelUp;
        public event Action<float, float> OnExpChanged;

        private void Awake()
        {
            if (_expCalculator == null)
            {
                _expCalculator = gameObject.AddComponent<ExperienceManager>();
            }
            _requiredExp = _expCalculator.GetRequiredExpForLevel(_currentLevel);
        }

        public void AddExperience(float amount)
        {
            if (amount <= 0f) return;

            _currentExp += amount;
            while (_currentExp >= _requiredExp)
            {
                _currentExp -= _requiredExp;
                _currentLevel++;
                _requiredExp = _expCalculator.GetRequiredExpForLevel(_currentLevel);

                OnLevelUp?.Invoke(_currentLevel);
                GameEventBus.Publish(new PlayerLevelUpEvent { NewLevel = _currentLevel });
            }

            OnExpChanged?.Invoke(_currentExp, _requiredExp);
        }
    }
}

