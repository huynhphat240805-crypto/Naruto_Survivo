using UnityEngine;

namespace SurvivalIO.Skills
{
    /// <summary>
    /// ScriptableObject defining static data and level scaling for passive and active skills.
    /// </summary>
    [CreateAssetMenu(fileName = "NewSkillData", menuName = "SurvivalIO/Data/Skill Data")]
    public class SkillDataSO : ScriptableObject
    {
        [Header("Identity")]
        [SerializeField] private string _id;
        [SerializeField] private string _skillName;
        [TextArea(2, 4)]
        [SerializeField] private string _description;
        [SerializeField] private Sprite _icon;
        [SerializeField] private SkillType _skillType;

        [Header("Evolution Linking")]
        [SerializeField] private string _pairedWeaponId;
        [SerializeField] private string _evolutionResultId;

        [Header("Progression")]
        [SerializeField] private SkillLevelStats[] _levels;

        public string Id => _id;
        public string SkillName => _skillName;
        public string Description => _description;
        public Sprite Icon => _icon;
        public SkillType Type => _skillType;
        public string PairedWeaponId => _pairedWeaponId;
        public string EvolutionResultId => _evolutionResultId;
        public int MaxLevel => _levels != null ? _levels.Length : 1;

        public SkillLevelStats GetStatsForLevel(int level)
        {
            if (_levels == null || _levels.Length == 0) return null;
            int index = Mathf.Clamp(level - 1, 0, _levels.Length - 1);
            return _levels[index];
        }
    }
}

