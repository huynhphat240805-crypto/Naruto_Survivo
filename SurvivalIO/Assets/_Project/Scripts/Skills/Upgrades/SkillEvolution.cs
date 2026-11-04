using System;
using UnityEngine;

namespace SurvivalIO.Skills
{
    [Serializable]
    public class SkillEvolution
    {
        [SerializeField] private string _evolutionId;
        [SerializeField] private string _evolutionName;
        [SerializeField] private string _requiredWeaponId;
        [SerializeField] private string _requiredPassiveId;
        [SerializeField] private int _requiredWeaponLevel = 5;
        [SerializeField] private int _requiredPassiveLevel = 1;
        [SerializeField] private string _resultWeaponId;

        public string EvolutionId => _evolutionId;
        public string EvolutionName => _evolutionName;
        public string RequiredWeaponId => _requiredWeaponId;
        public string RequiredPassiveId => _requiredPassiveId;
        public int RequiredWeaponLevel => _requiredWeaponLevel;
        public int RequiredPassiveLevel => _requiredPassiveLevel;
        public string ResultWeaponId => _resultWeaponId;

        public bool CanEvolve(string weaponId, int weaponLevel, string passiveId, int passiveLevel)
        {
            return weaponId == _requiredWeaponId &&
                   weaponLevel >= _requiredWeaponLevel &&
                   passiveId == _requiredPassiveId &&
                   passiveLevel >= _requiredPassiveLevel;
        }
    }
}

