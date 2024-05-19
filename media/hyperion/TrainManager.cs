using BeltainsTools.EventHandling;
using BeltainsTools.Pooling;
using BeltainsTools.Serialization;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TrainManager : Singleton<TrainManager>
{
    [SerializeField, UnityEngine.Serialization.FormerlySerializedAs("m_TrainPrefab")] protected Unit_Train m_TrainBasePrefab;
    [SerializeField] protected GridAreaHighlight m_GridSelector;
    [SerializeField] protected GridAreaHighlight m_GridHighlighter;

    [Header("Debug")]
    [SerializeField] protected Unit_Train.Preset m_DebugTrainPreset;
    [SerializeField] protected float m_DebugTrainSpeed = 50f;

    public bool IsTrainActive => CurrentTrain != null;
    public Unit_Train CurrentTrain { get; private set; } = null;


    public new class SingletonSaveData : SingletonSaveData<SingletonSaveData>
    {
        public Unit_Train.SaveData TrainSaveData;
    }




    public void SpawnDebugTrain() => SpawnTrain(m_DebugTrainPreset);
    public void SpawnTrain(Unit_Train.Preset preset)
    {
        SpawnEmptyTrain();
        CurrentTrain.SetFromPreset(preset);
        CurrentTrain.SetSpeed(m_DebugTrainSpeed);
    }

    public void SpawnTrain(Unit_Train.SaveData data)
    {
        SpawnEmptyTrain();
        CurrentTrain.Deserialize(data);
    }

    void SpawnEmptyTrain() => SpawnEmptyTrain(Vector3.zero, Quaternion.identity, transform);
    void SpawnEmptyTrain(Vector3 pos, Quaternion rot, Transform parent)
    {
        TryClearCurrentTrain();
        CurrentTrain = m_TrainBasePrefab.Spawn(pos, rot, parent); //We only allow one train instance, always set the new train to the current train
    }

    public void TryClearCurrentTrain()
    {
        if (!IsTrainActive)
            return;
        CurrentTrain.Recycle();
        CurrentTrain = null;
    }


    public void HighlightCarGrid(Unit_TrainCar car)
    {
        m_GridHighlighter.HighlightGridPositions(car.Grid, car.Grid.CellPositions);
        m_GridHighlighter.SetVisualStyle(GridAreaHighlight.VisualTypes.Subtle);
    }

    public void EnableCarGridHighlight(bool state)
        => m_GridHighlighter.gameObject.SetActive(state);


    public void ClearTrainGridSelector()
    {
        m_GridSelector.gameObject.SetActive(false);
    }

    public void SetTrainGridSelector(TrainGrid.Cell gridCell, GridAreaHighlight.VisualTypes style = GridAreaHighlight.VisualTypes.Positive)
    {
        if (gridCell == null)
        {
            ClearTrainGridSelector();
            return;
        }

        m_GridSelector.gameObject.SetActive(true);

        m_GridSelector.HighlightGridCell(gridCell);
        m_GridSelector.SetVisualStyle(style);
    }

    public void SetTrainGridSelector(TrainGrid grid, Vector2Int[] gridPositions, GridAreaHighlight.VisualTypes style = GridAreaHighlight.VisualTypes.Positive)
    {
        m_GridSelector.gameObject.SetActive(true);
        
        m_GridSelector.HighlightGridPositions(grid, gridPositions);
        m_GridSelector.SetVisualStyle(style);
    }


    public Unit_GridOccupier GetGridOccupierUnderCursor()
        => ThingyManager.Inst.TryGetThingyUnderCursor(out Thingy resultantThingy, r => r.HasUnit<Unit_GridOccupier>()) ? resultantThingy.GetUnit<Unit_GridOccupier>() : null;

    static Collider _s_GridCollider = null;
    static TrainGrid _s_TrainGrid = null;
    public TrainGrid.Cell GetTrainCellUnderCursor()
    {
        TrainGrid.Cell closestCell = null;
        Ray ray = CameraManager.MainCam.ScreenPointToRay(Cursor.Inst.CursorPosition);
        if (Physics.Raycast(ray, out RaycastHit hitInfo, 9999f, 1 << Globals.PhysicsLayers.s_LayerIndex_TrainBuildingBase))
        {
            if (_s_GridCollider == null || _s_GridCollider != hitInfo.collider)
            {
                _s_GridCollider = hitInfo.collider;
                _s_TrainGrid = _s_GridCollider.GetComponent<TrainGrid>();
            }

            closestCell = _s_TrainGrid.GetCellClosestTo(hitInfo.point);
        }
        return closestCell;
    }





    protected override bool CanSerialize() => GameStateManager.Inst.CurrentStateType == GameStates.Types.TrainView;
    protected override void SerializeData()
    {
        CurrentTrain.Serialize(out BeltainsTools.Serialization.SaveData trainSaveData);
        Data = new SingletonSaveData()
        {
            TrainSaveData = (Unit_Train.SaveData)trainSaveData
        };
    }

    protected override void DeserializeData()
    { 
        SingletonSaveData data = (SingletonSaveData)Data;
        SpawnTrain(data.TrainSaveData);
    }



    protected override void OnEnteredGameState() { }
    protected override void OnExitedGameState() { }



    protected override void OnAwake()
    {
        ClearTrainGridSelector();
    }
}