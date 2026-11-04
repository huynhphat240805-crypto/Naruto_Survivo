using UnityEngine;

namespace SurvivalIO.Skills
{
    /// <summary>
    /// Controls execution and visual feedback for individual equipped skills.
    /// </summary>
    public class SkillController : MonoBehaviour
    {
        [SerializeField] private SkillDataSO _skillData;
        private PassiveSkill _passiveComponent;
        private ActiveSkill _activeComponent;

        public SkillDataSO Data => _skillData;

        public void Initialize(SkillDataSO data, Transform owner)
        {
            _skillData = data;
            if (data.Type == SkillType.PassiveStat)
            {
                _passiveComponent = gameObject.AddComponent<PassiveSkill>();
                _passiveComponent.Initialize(data);
            }
            else
            {
                _activeComponent = gameObject.AddComponent<ActiveSkill>();
                _activeComponent.Initialize(data, 8f);
                _activeComponent.Activate(owner);
            }
        }
    }
}

