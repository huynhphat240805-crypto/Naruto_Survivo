using UnityEngine;

namespace SurvivalIO.Weapons
{
    /// <summary>
    /// ScriptableObject defining static data and level scaling for weapons.
    /// </summary>
    [CreateAssetMenu(fileName = "NewWeaponData", menuName = "SurvivalIO/Data/Weapon Data")]
    public class WeaponDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _weaponName;
        [TextArea(2, 4)]
        [SerializeField] private string _description;
        [SerializeField] private Sprite _icon;

        [Header("Mechanics")]
        [SerializeField] private WeaponAttackType _attackType;
        [SerializeField] private GameObject _projectilePrefab;

        [Header("Level Progressions")]
        [SerializeField] private WeaponLevelStats[] _levels;

        public string Id => _id;
        public string WeaponName => _weaponName;
        public string Description => _description;
        public Sprite Icon => _icon;
        public WeaponAttackType AttackType => _attackType;
        public GameObject ProjectilePrefab => _projectilePrefab;
        public int MaxLevel => _levels != null ? _levels.Length : 1;

        public WeaponLevelStats GetStatsForLevel(int level)
        {
            if (_levels == null || _levels.Length == 0) return null;
            int index = Mathf.Clamp(level - 1, 0, _levels.Length - 1);
            return _levels[index];
        }
    }
}

