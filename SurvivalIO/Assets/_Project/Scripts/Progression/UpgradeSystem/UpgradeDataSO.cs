using UnityEngine;
using SurvivalIO.Weapons;
using SurvivalIO.Skills;

namespace SurvivalIO.Progression
{
    public enum UpgradeCategory
    {
        Weapon,
        Skill,
        Evolution,
        ConsumableStat
    }

    /// <summary>
    /// ScriptableObject defining selectable upgrade choices presented on level-up.
    /// </summary>
    [CreateAssetMenu(fileName = "NewUpgradeData", menuName = "SurvivalIO/Data/Upgrade Data")]
    public class UpgradeDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _title;
        [TextArea(2, 4)]
        [SerializeField] private string _description;
        [SerializeField] private Sprite _icon;
        [SerializeField] private UpgradeCategory _category;

        [Header("References")]
        [SerializeField] private WeaponDataSO _weaponData;
        [SerializeField] private SkillDataSO _skillData;

        public string Id => _id;
        public string Title => _title;
        public string Description => _description;
        public Sprite Icon => _icon;
        public UpgradeCategory Category => _category;
        public WeaponDataSO WeaponData => _weaponData;
        public SkillDataSO SkillData => _skillData;
    }
}

